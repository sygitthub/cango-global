"""
一键构建前端数据脚本。

功能：
1. 从 Excel【汇总表】CANGO海外资源库-数据清洗 2026.02 更新.xlsx 读取最新数据，
   调用现有清洗逻辑生成标准化结果（cango-global result.json）。
2. 基于清洗结果构建压缩版数据结构，写入 data.json（供备查或其他用途）。
3. 根据压缩数据自动计算：
   - 机构总数（去重后）
   - 覆盖大洲数
   - 各大洲机构数量
   并直接更新 index.html 里的 summaryMetrics 与 regionDistribution 常量。

使用方式：
在项目根目录（E:/GitHub/cango-global）运行：

    python build_site_data.py

运行成功后，刷新浏览器中的 index.html 即可看到最新统计。
"""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Dict, List, Tuple

from rebuild_cango_from_excel import main as rebuild_from_excel
from json_to_js_lite import build_lite_payload


ROOT = Path(__file__).resolve().parent
INDEX_PATH = ROOT / "index.html"
DATA_JSON_PATH = ROOT / "data.json"


REGION_STD_TO_KEY: Dict[str, str] = {
    "欧洲": "Europe",
    "亚洲": "Asia",
    "北美": "North America",
    "南美/拉美": "South America",
    "非洲": "Africa",
    "大洋洲": "Oceania",
    "中亚": "Central Asia",
    "中东": "Middle East",
}

# 保持与前端 regionDistribution 同样的顺序与配色
REGION_KEY_ORDER: List[Tuple[str, str, str]] = [
    ("Europe", "欧洲 (Europe)", "#4F86FF"),
    ("Asia", "亚洲 (Asia)", "#22C55E"),
    ("North America", "北美洲 (North America)", "#EAB308"),
    ("Africa", "非洲 (Africa)", "#F97316"),
    ("South America", "南美洲 (South America)", "#06B6D4"),
    ("Oceania", "大洋洲 (Oceania)", "#A855F7"),
    ("Central Asia", "中亚 (Central Asia)", "#F43F5E"),
    ("Middle East", "中东 (Middle East)", "#8B5CF6"),
]


def compute_metrics_from_payload(payload: dict) -> Tuple[dict, List[dict]]:
    """从压缩后的 orgs 列表中计算 summaryMetrics 与 regionDistribution 数值部分。"""
    orgs = payload.get("orgs") or []

    # 机构总数（orgs 已按名称去重）
    total_orgs = len(orgs)

    # 区域分布
    counts_by_key: Dict[str, int] = {}
    for item in orgs:
        std = str(item.get("regionStd") or "").strip()
        if not std:
            continue
        key = REGION_STD_TO_KEY.get(std)
        if not key:
            continue
        counts_by_key[key] = counts_by_key.get(key, 0) + 1

    regions_covered = sum(1 for v in counts_by_key.values() if v > 0)

    summary_metrics = {
        "totalOrgs": total_orgs,
        # 以下两个暂保持固定值，由你按需在脚本中后续扩展统计逻辑
        "activeOrgs": 190,
        "regionsCovered": regions_covered or 8,
        "orgsWithBranches": 156,
    }

    region_distribution: List[dict] = []
    for key, label, color in REGION_KEY_ORDER:
        value = counts_by_key.get(key, 0)
        region_distribution.append(
            {"label": label, "key": key, "value": value, "color": color}
        )

    return summary_metrics, region_distribution


def update_index_html(summary: dict, region_dist: List[dict]) -> None:
    """将新的 summaryMetrics 与 regionDistribution 写回 index.html。"""
    text = INDEX_PATH.read_text(encoding="utf-8")

    # 更新 summaryMetrics
    summary_js = (
        "const summaryMetrics = {\n"
        f"        totalOrgs: {summary['totalOrgs']},\n"
        f"        activeOrgs: {summary['activeOrgs']},\n"
        f"        regionsCovered: {summary['regionsCovered']},\n"
        f"        orgsWithBranches: {summary['orgsWithBranches']},\n"
        "      };"
    )

    text, n1 = re.subn(
        r"const summaryMetrics = \{[\s\S]*?\};",
        summary_js,
        text,
        count=1,
    )

    # 更新 regionDistribution
    region_lines = ["const regionDistribution = ["]
    for entry in region_dist:
        region_lines.append(
            "        { "
            f'label: "{entry["label"]}", '
            f'key: "{entry["key"]}", '
            f"value: {entry['value']}, "
            f'color: "{entry["color"]}" '
            "},"
        )
    region_lines.append("      ];")
    region_js = "\n".join(region_lines)

    text, n2 = re.subn(
        r"const regionDistribution = \[[\s\S]*?];",
        region_js,
        text,
        count=1,
    )

    INDEX_PATH.write_text(text, encoding="utf-8")

    print(f"index.html 已更新：summaryMetrics({n1} 处)、regionDistribution({n2} 处)")


def main() -> None:
    # 1. 先从 Excel 重新构建标准化结果（写入 cango-global result.json）
    print(">>> 从 Excel 重新构建标准化结果…")
    rebuild_from_excel()

    # 2. 基于标准化结果构建轻量数据（与前端结构一致）
    print(">>> 从标准化结果构建压缩数据 payload…")
    payload = build_lite_payload()

    # 写入 data.json 供检查或其他用途
    DATA_JSON_PATH.write_text(
        json.dumps(payload, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )
    print(f">>> 已写入压缩数据：{DATA_JSON_PATH}")

    # 3. 计算 summaryMetrics 与 regionDistribution，并写回 index.html
    summary, region_dist = compute_metrics_from_payload(payload)
    print(">>> 统计结果：")
    print("    - 机构总数:", summary["totalOrgs"])
    print("    - 覆盖大洲数:", summary["regionsCovered"])
    print(
        "    - 区域分布:",
        ", ".join(f'{e["key"]}={e["value"]}' for e in region_dist),
    )

    print(">>> 更新 index.html 中的数据常量…")
    update_index_html(summary, region_dist)

    print(">>> 完成。刷新浏览器中的 index.html 以查看最新效果。")


if __name__ == "__main__":
    main()

