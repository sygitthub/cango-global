from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass
from datetime import datetime
from pathlib import Path
from typing import Iterable
from urllib.parse import urlparse


ROOT = Path(__file__).resolve().parent
DATA_JSON_PATH = ROOT / "data.json"
REPORT_PATH = ROOT / "data-quality-report.md"

EXPECTED_TOTAL = 203
EXPECTED_CONTINENT_COUNTS = {
  "欧洲": 95,
  "亚洲": 69,
  "北美": 28,
  "南美/拉美": 4,
  "非洲": 4,
  "大洋洲": 3,
}
EXPECTED_ASIA_SUB_REGION_COUNTS = {
  "东亚": 42,
  "东南亚": 19,
  "南亚": 4,
  "中亚": 2,
  "中东": 2,
}

VALID_CONTINENTS = set(EXPECTED_CONTINENT_COUNTS)
VALID_ASIA_SUB_REGIONS = set(EXPECTED_ASIA_SUB_REGION_COUNTS) | {"亚洲其他"}

EMAIL_RE = re.compile(r"^[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}$", re.I)
EMAIL_FIND_RE = re.compile(r"[A-Z0-9._%+\-]+@[A-Z0-9.\-]+\.[A-Z]{2,}", re.I)
DOMAIN_RE = re.compile(r"\b(?:[a-z0-9-]+\.)+[a-z]{2,}\b", re.I)
URL_RE = re.compile(r"^https?://", re.I)

NO_INFO_MARKERS = (
  "暂无",
  "未检索",
  "找不到",
  "无官方",
  "无公开",
  "nan",
  "none",
  "n/a",
)


@dataclass
class QualityIssue:
  severity: str
  org: str
  field: str
  message: str
  value: str = ""
  suggestion: str = ""


def compact_text(value) -> str:
  if value is None:
    return ""
  text = str(value).replace("\u3000", " ").strip()
  if not text or text.lower() == "nan":
    return ""
  return re.sub(r"\s+", " ", text).strip()


def is_missing(value) -> bool:
  text = compact_text(value)
  if not text:
    return True
  return any(marker in text.lower() for marker in NO_INFO_MARKERS)


def snippet(value, max_len: int = 150) -> str:
  text = compact_text(value)
  return text if len(text) <= max_len else text[: max_len - 1].rstrip() + "…"


def markdown_cell(value) -> str:
  text = compact_text(value)
  return text.replace("|", "\\|") if text else ""


def domain_from_url(value: str) -> str:
  text = compact_text(value)
  if not text or is_missing(text):
    return ""
  url_match = re.search(r"https?://[^\s，,；;）)]+", text, re.I)
  if url_match:
    text = url_match.group(0)
  candidate = text if URL_RE.search(text) else f"https://{text}"
  try:
    parsed = urlparse(candidate)
  except ValueError:
    return ""
  host = parsed.netloc.lower()
  if host.startswith("www."):
    host = host[4:]
  return host


def split_email_candidates(value: str) -> list[str]:
  text = compact_text(value)
  if not text or is_missing(text):
    return []
  parts = re.split(r"[,;/；，、\s]+", text)
  return [part.strip("<>()[]{}") for part in parts if "@" in part]


def normalized_names(org: dict) -> set[str]:
  names = set()
  for key in ("title", "alias", "nameCn"):
    text = compact_text(org.get(key))
    if len(text) >= 4:
      names.add(text.lower())
    if "(" in text:
      head = text.split("(", 1)[0].strip()
      if len(head) >= 4:
        names.add(head.lower())
  return names


def add_issue(
  issues: list[QualityIssue],
  severity: str,
  org: str,
  field: str,
  message: str,
  value: str = "",
  suggestion: str = "",
) -> None:
  issues.append(QualityIssue(severity, org or "全局", field, message, snippet(value), suggestion))


def load_payload(path: Path = DATA_JSON_PATH) -> dict:
  return json.loads(path.read_text(encoding="utf-8"))


def run_data_quality_checks(payload: dict) -> tuple[list[QualityIssue], dict]:
  orgs = payload.get("orgs") or []
  issues: list[QualityIssue] = []

  total = len(orgs)
  if total != EXPECTED_TOTAL:
    add_issue(
      issues,
      "ERROR",
      "",
      "orgs",
      f"机构总数为 {total}，不等于预期 {EXPECTED_TOTAL}",
      suggestion="先确认 Excel 清洗结果是否新增/删除机构，再更新预期分布。",
    )

  title_counts = Counter(compact_text(org.get("title")) for org in orgs if compact_text(org.get("title")))
  for title, count in title_counts.items():
    if count > 1:
      add_issue(issues, "ERROR", title, "title", f"机构名称重复 {count} 次", title)

  continent_counts = Counter(compact_text(org.get("continentStd")) for org in orgs)
  asia_sub_region_counts = Counter(
    compact_text(org.get("subRegionStd"))
    for org in orgs
    if compact_text(org.get("continentStd")) == "亚洲" and compact_text(org.get("subRegionStd"))
  )

  for continent, expected in EXPECTED_CONTINENT_COUNTS.items():
    actual = continent_counts.get(continent, 0)
    if actual != expected:
      add_issue(
        issues,
        "ERROR",
        "",
        "continentStd",
        f"{continent} 数量为 {actual}，不等于预期 {expected}",
        suggestion="检查 regionStd -> continentStd 映射或更新预期口径。",
      )

  for sub_region, expected in EXPECTED_ASIA_SUB_REGION_COUNTS.items():
    actual = asia_sub_region_counts.get(sub_region, 0)
    if actual != expected:
      add_issue(
        issues,
        "ERROR",
        "",
        "subRegionStd",
        f"{sub_region} 数量为 {actual}，不等于预期 {expected}",
        suggestion="检查国家到亚洲子区域的映射规则。",
      )

  domain_to_orgs: dict[str, list[str]] = defaultdict(list)
  email_to_orgs: dict[str, list[str]] = defaultdict(list)
  all_names: list[tuple[str, str]] = []

  for org in orgs:
    title = compact_text(org.get("title"))
    for name in normalized_names(org):
      all_names.append((name, title))

    domain = domain_from_url(org.get("website", ""))
    if domain:
      domain_to_orgs[domain].append(title)

    for email in split_email_candidates(org.get("email", "")):
      email_to_orgs[email.lower()].append(title)

  for org in orgs:
    title = compact_text(org.get("title"))

    for field in ("title", "continentStd", "country", "natureStd", "functionStd", "body"):
      if is_missing(org.get(field)):
        add_issue(issues, "WARN", title, field, "关键字段为空或仅包含缺省说明", org.get(field))

    continent = compact_text(org.get("continentStd"))
    sub_region = compact_text(org.get("subRegionStd"))
    region = compact_text(org.get("regionStd"))
    if continent not in VALID_CONTINENTS:
      add_issue(issues, "ERROR", title, "continentStd", "未知大洲分类", continent)
    if continent == "亚洲":
      if sub_region not in VALID_ASIA_SUB_REGIONS:
        add_issue(issues, "ERROR", title, "subRegionStd", "亚洲机构缺少有效亚洲子区域", sub_region)
      if region in ("中亚", "中东") and sub_region != region:
        add_issue(issues, "ERROR", title, "subRegionStd", "中亚/中东机构的亚洲子区域与 regionStd 不一致", sub_region)
    elif sub_region:
      add_issue(issues, "WARN", title, "subRegionStd", "非亚洲机构不应带亚洲子区域", sub_region)

    website = compact_text(org.get("website"))
    if not is_missing(website):
      if not URL_RE.search(website) and not DOMAIN_RE.search(website):
        add_issue(issues, "WARN", title, "website", "官网字段不像 URL 或域名", website)
      elif " " in website:
        add_issue(issues, "WARN", title, "website", "官网字段包含空格，可能混入备注", website)

    email = compact_text(org.get("email"))
    if not is_missing(email):
      emails = split_email_candidates(email)
      if not emails or any(not EMAIL_RE.match(item) for item in emails):
        add_issue(issues, "WARN", title, "email", "邮箱格式需要人工确认", email)

    phone = compact_text(org.get("phone"))
    if phone and EMAIL_FIND_RE.search(phone):
      add_issue(issues, "WARN", title, "phone", "电话字段疑似混入邮箱", phone)
    if phone and DOMAIN_RE.search(phone):
      add_issue(issues, "WARN", title, "phone", "电话字段疑似混入网址", phone)

    contact_name = compact_text(org.get("contactName"))
    contact_title = compact_text(org.get("contactTitle"))
    if contact_name and contact_title and contact_name == contact_title:
      add_issue(issues, "WARN", title, "contactName/contactTitle", "联系人和职位完全相同", contact_name)
    if contact_name in {"机构", "无", "暂无", "未检索到公开联系人"}:
      add_issue(issues, "INFO", title, "contactName", "联系人字段为泛化占位内容", contact_name)

    cooperation_status = compact_text(org.get("cooperationStatus"))
    if len(cooperation_status) > 80 or "正常运营" in cooperation_status:
      add_issue(
        issues,
        "WARN",
        title,
        "cooperationStatus",
        "合作状态字段疑似混入说明性长文本或运营状态",
        cooperation_status,
      )

    status_note = compact_text(org.get("statusNote"))
    if status_note:
      own_names = normalized_names(org)
      own_domain = domain_from_url(org.get("website", ""))
      for other_name, other_title in all_names:
        if other_title == title or other_name in own_names:
          continue
        if other_name in status_note.lower():
          add_issue(
            issues,
            "ERROR",
            title,
            "statusNote",
            f"运营状态说明疑似提到其他机构：{other_title}",
            status_note,
            "回到 Excel 对该行状态说明做人工核对，确认是否串行。",
          )
          break
      for found_domain in set(match.group(0).lower() for match in DOMAIN_RE.finditer(status_note)):
        clean_found = found_domain[4:] if found_domain.startswith("www.") else found_domain
        if own_domain and clean_found != own_domain and clean_found not in own_domain and own_domain not in clean_found:
          add_issue(
            issues,
            "ERROR",
            title,
            "statusNote",
            f"运营状态说明包含与官网不一致的域名：{clean_found}",
            status_note,
            "优先核对该行是否引用了其他机构官网或状态说明。",
          )
          break

  for domain, titles in sorted(domain_to_orgs.items()):
    if len(titles) > 1:
      add_issue(
        issues,
        "INFO",
        "；".join(titles[:5]),
        "website",
        f"同一官网域名被 {len(titles)} 家机构使用：{domain}",
        suggestion="若为联盟/母机构网站可忽略；否则检查官网是否复制错行。",
      )

  for email, titles in sorted(email_to_orgs.items()):
    if len(titles) > 1:
      add_issue(
        issues,
        "INFO",
        "；".join(titles[:5]),
        "email",
        f"同一邮箱被 {len(titles)} 家机构使用：{email}",
        suggestion="若为统一咨询邮箱可忽略；否则检查联系人字段是否复制错行。",
      )

  summary = {
    "total": total,
    "issueCounts": dict(Counter(issue.severity for issue in issues)),
    "continentCounts": dict(continent_counts),
    "asiaSubRegionCounts": dict(asia_sub_region_counts),
  }
  return issues, summary


def render_report(issues: Iterable[QualityIssue], summary: dict) -> str:
  issues = list(issues)
  generated_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
  counts = Counter(issue.severity for issue in issues)
  ordered = sorted(
    issues,
    key=lambda item: ({"ERROR": 0, "WARN": 1, "INFO": 2}.get(item.severity, 9), item.org, item.field),
  )

  lines = [
    "# CANGO 数据质检报告",
    "",
    f"- 生成时间：{generated_at}",
    f"- 机构总数：{summary.get('total', 0)}",
    f"- 问题统计：ERROR {counts.get('ERROR', 0)} / WARN {counts.get('WARN', 0)} / INFO {counts.get('INFO', 0)}",
    "",
    "## 分布校验",
    "",
    "| 维度 | 实际 | 预期 |",
    "|---|---:|---:|",
  ]
  continent_counts = summary.get("continentCounts", {})
  for label, expected in EXPECTED_CONTINENT_COUNTS.items():
    lines.append(f"| {label} | {continent_counts.get(label, 0)} | {expected} |")
  asia_counts = summary.get("asiaSubRegionCounts", {})
  for label, expected in EXPECTED_ASIA_SUB_REGION_COUNTS.items():
    lines.append(f"| 亚洲子区域：{label} | {asia_counts.get(label, 0)} | {expected} |")

  lines.extend([
    "",
    "## 重点排查",
    "",
  ])
  if counts.get("ERROR", 0):
    lines.extend([
      "以下为发布前建议优先人工核对的问题，通常对应疑似串行、区域口径或关键字段错误。",
      "",
      "| 机构 | 字段 | 问题 | 当前值 | 建议 |",
      "|---|---|---|---|---|",
    ])
    for issue in [item for item in ordered if item.severity == "ERROR"]:
      lines.append(
        "| "
        + " | ".join(
          markdown_cell(cell)
          for cell in (
            issue.org,
            issue.field,
            issue.message,
            issue.value,
            issue.suggestion,
          )
        )
        + " |"
      )
  else:
    lines.append("未发现 ERROR 级别问题。")

  field_counts = Counter(issue.field for issue in issues)
  if field_counts:
    lines.extend([
      "",
      "### 问题字段分布",
      "",
      "| 字段 | 问题数 |",
      "|---|---:|",
    ])
    for field, count in field_counts.most_common():
      lines.append(f"| {markdown_cell(field)} | {count} |")

  lines.extend([
    "",
    "## 待核查清单",
    "",
  ])
  if not ordered:
    lines.append("未发现质检问题。")
  else:
    lines.extend([
      "| 级别 | 机构 | 字段 | 问题 | 当前值 | 建议 |",
      "|---|---|---|---|---|---|",
    ])
    for issue in ordered:
      lines.append(
        "| "
        + " | ".join(
          markdown_cell(cell)
          for cell in (
            issue.severity,
            issue.org,
            issue.field,
            issue.message,
            issue.value,
            issue.suggestion,
          )
        )
        + " |"
      )

  lines.extend([
    "",
    "## 使用说明",
    "",
    "- `ERROR`：优先核对，通常表示数量口径、区域映射、重复名称或疑似串行字段。",
    "- `WARN`：建议人工确认，通常表示格式异常、关键字段缺省或字段内容混入其他类型信息。",
    "- `INFO`：提示性信息，可能是合理共享字段，也可能帮助发现复制错行。",
  ])
  return "\n".join(lines) + "\n"


def write_quality_report(payload: dict, path: Path = REPORT_PATH) -> tuple[list[QualityIssue], dict]:
  issues, summary = run_data_quality_checks(payload)
  path.write_text(render_report(issues, summary), encoding="utf-8")
  return issues, summary


def main() -> None:
  payload = load_payload()
  issues, summary = write_quality_report(payload)
  counts = Counter(issue.severity for issue in issues)
  print(
    "数据质检完成："
    f"orgs={summary['total']}, "
    f"ERROR={counts.get('ERROR', 0)}, "
    f"WARN={counts.get('WARN', 0)}, "
    f"INFO={counts.get('INFO', 0)}"
  )
  print(f"报告已写入：{REPORT_PATH}")


if __name__ == "__main__":
  main()
