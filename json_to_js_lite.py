import json
from pathlib import Path


def clean_text(value) -> str:
  if value is None:
    return ""
  text = str(value).replace("\u3000", " ").strip()
  if not text or text.lower() == "nan":
    return ""
  lines = [" ".join(line.split()) for line in text.splitlines()]
  return "\n".join(line for line in lines if line).strip()


def first_line(value) -> str:
  text = clean_text(value)
  return text.split("\n", 1)[0].strip() if text else ""


def split_unique(values) -> list[str]:
  items = []
  seen = set()
  for value in values:
    text = clean_text(value)
    if not text:
      continue
    parts = []
    for part in text.split("\n"):
      label = " ".join(part.split()).strip()
      if not label:
        continue
      if label.startswith("(") and parts:
        parts[-1] = f"{parts[-1]} {label}"
      else:
        parts.append(label)
    for label in parts:
      if label in seen:
        continue
      seen.add(label)
      items.append(label)
  return items


def normalize_region_std(row: dict) -> str:
  region_std = clean_text(row.get("总部所在区域_标准化"))
  if region_std:
    return region_std

  raw = clean_text(row.get("总部所在") or row.get("Unnamed: 11"))
  if "中亚" in raw or "Central Asia" in raw:
    return "中亚"
  if "中东" in raw or "Middle East" in raw:
    return "中东"
  if "欧洲" in raw or "Europe" in raw:
    return "欧洲"
  if "亚洲" in raw or "Asia" in raw:
    return "亚洲"
  if "北美" in raw or "North America" in raw:
    return "北美"
  if "南美" in raw or "拉美" in raw or "Latin America" in raw or "South America" in raw:
    return "南美/拉美"
  if "非洲" in raw or "Africa" in raw:
    return "非洲"
  if "大洋洲" in raw or "澳洲" in raw or "Oceania" in raw:
    return "大洋洲"
  return ""


def derive_continent_std(region_std: str) -> str:
  region = clean_text(region_std)
  if region in ("亚洲", "中亚", "中东"):
    return "亚洲"
  return region


ASIA_SUB_REGION_COUNTRIES = {
  "东亚": ["日本", "韩国", "中国香港", "香港", "中国澳门", "澳门", "中国", "台湾", "蒙古"],
  "东南亚": [
    "菲律宾",
    "泰国",
    "柬埔寨",
    "新加坡",
    "马来西亚",
    "越南",
    "印度尼西亚",
    "印尼",
    "缅甸",
    "老挝",
    "文莱",
    "东帝汶",
  ],
  "南亚": ["印度", "尼泊尔", "孟加拉", "巴基斯坦", "斯里兰卡", "不丹", "马尔代夫", "阿富汗"],
  "中亚": ["哈萨克斯坦", "乌兹别克斯坦", "吉尔吉斯斯坦", "塔吉克斯坦", "土库曼斯坦"],
  "中东": [
    "沙特",
    "卡塔尔",
    "阿联酋",
    "阿拉伯联合酋长国",
    "以色列",
    "约旦",
    "黎巴嫩",
    "伊朗",
    "伊拉克",
    "土耳其",
    "叙利亚",
    "巴林",
    "科威特",
    "阿曼",
    "也门",
    "巴勒斯坦",
  ],
}


def derive_sub_region_std(region_std: str, country: str) -> str:
  region = clean_text(region_std)
  if region in ("中亚", "中东"):
    return region
  if derive_continent_std(region) != "亚洲":
    return ""

  country_text = clean_text(country)
  for sub_region, keywords in ASIA_SUB_REGION_COUNTRIES.items():
    if any(keyword in country_text for keyword in keywords):
      return sub_region
  return "亚洲其他"


def parse_founded_year(value):
  founded_str = clean_text(value)
  try:
    return int(float(founded_str)) if founded_str else None
  except ValueError:
    return None


def build_lite_payload() -> dict:
  src_path = Path("cango-global result.json")
  if not src_path.exists():
    raise FileNotFoundError(f"未找到 JSON 文件: {src_path}")

  data = json.loads(src_path.read_text(encoding="utf-8"))
  rows = data.get("机构总表", [])

  lite_orgs = []
  seen_names = set()

  for row in rows:
    name_std = clean_text(row.get("机构名称_标准化") or row.get("机构名称"))
    if not name_std or name_std in seen_names:
      continue
    seen_names.add(name_std)

    region_std = normalize_region_std(row)
    if not region_std:
      continue

    country = clean_text(row.get("Unnamed: 6"))
    founded_str = clean_text(row.get("成立时间"))
    nature_raw = clean_text(row.get("机构性质\n（法律身份、本质属性）") or row.get("机构性质"))
    function_raw = clean_text(row.get("机构类型\n（职能定位、合作方式）"))
    raw_intro = clean_text(row.get("机构业务及开展区域") or row.get("备注"))
    intro = raw_intro[:200].rstrip() + "……" if len(raw_intro) > 200 else raw_intro
    primary_region = clean_text(row.get("总部所在") or row.get("Unnamed: 11") or region_std)
    status_text = clean_text(row.get("Unnamed: 29"))

    if "正常运营" in status_text or "存续" in status_text:
      status_std = "Active"
      warning_reason = ""
    elif status_text:
      status_std = "Warning"
      warning_reason = status_text.replace("\n", " ")[:120].rstrip()
      if len(status_text.replace("\n", " ")) > 120:
        warning_reason += "…"
    else:
      status_std = ""
      warning_reason = ""

    subtitle_parts = [part for part in [founded_str, nature_raw] if part]
    topics = split_unique([
      row.get("主要关注哪类议题"),
      row.get("Unnamed: 17"),
      row.get("Unnamed: 18"),
    ])

    lite_orgs.append({
      "regionStd": region_std,
      "continentStd": derive_continent_std(region_std),
      "subRegionStd": derive_sub_region_std(region_std, country),
      "title": name_std,
      "alias": clean_text(row.get("机构名称.1")),
      "nameCn": clean_text(row.get("Unnamed: 3")),
      "subtitle": " ｜ ".join(subtitle_parts),
      "body": intro,
      "tag": primary_region,
      "country": country,
      "city": clean_text(row.get("Unnamed: 7")),
      "foundedYear": parse_founded_year(row.get("成立时间")),
      "natureStd": first_line(nature_raw),
      "functionStd": first_line(function_raw),
      "secondaryFunction": first_line(row.get("Unnamed: 15")),
      "topics": topics,
      "workRegions": clean_text(row.get("Unnamed: 11")),
      "extraWorkRegions": clean_text(row.get("Unnamed: 12")),
      "contactName": clean_text(row.get("联系方式")),
      "contactTitle": clean_text(row.get("Unnamed: 20")),
      "email": clean_text(row.get("Unnamed: 21")),
      "website": clean_text(row.get("Unnamed: 22")),
      "phone": clean_text(row.get("Unnamed: 23")),
      "networks": clean_text(row.get("备注")),
      "orgNotes": clean_text(row.get("Unnamed: 25")),
      "chinaConnection": clean_text(row.get("Unnamed: 26")),
      "cooperationStatus": clean_text(row.get("Unnamed: 27")),
      "cooperationNotes": clean_text(row.get("Unnamed: 28")),
      "hasBranches": clean_text(row.get("是否有分支机构")) == "是",
      "statusStd": status_std,
      "statusNote": status_text,
      "warningReason": warning_reason,
    })

  return {"orgs": lite_orgs}


def main() -> None:
  payload = build_lite_payload()
  out_path = Path("cango-data-lite.js")

  with out_path.open("w", encoding="utf-8") as f:
    f.write("// 由 json_to_js_lite.py 自动生成，请勿手工编辑\n")
    f.write("window.CANGO_DATA = ")
    json.dump(payload, f, ensure_ascii=False)
    f.write(";\n")

  print(f"已生成 {out_path}，共 {len(payload['orgs'])} 家唯一机构（按名称去重且带区域信息）。")


if __name__ == "__main__":
  main()
