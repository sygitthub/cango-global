import json
from pathlib import Path


def main() -> None:
    path = Path("cango-global result.json")
    data = json.loads(path.read_text(encoding="utf-8"))
    rows = data.get("机构总表", [])
    print("总记录数:", len(rows))

    # 统计标准化区域字段
    from collections import Counter

    c_std = Counter()
    c_raw = Counter()
    for r in rows:
        std = str(r.get("总部所在区域_标准化") or "").strip()
        raw = str(r.get("总部所在") or r.get("Unnamed: 11") or "").strip()
        if std:
            c_std[std] += 1
        if raw:
            c_raw[raw] += 1

    print("\n标准化区域字段分布:")
    for k, v in c_std.most_common():
        print(v, "x", k)

    print("\n原始区域字段包含“中亚”的记录:")
    for r in rows:
        raw = str(r.get("总部所在") or r.get("Unnamed: 11") or "").strip()
        if "中亚" in raw or "Central Asia" in raw:
            name = str(
                r.get("机构名称_标准化") or r.get("机构名称") or ""
            ).strip()
            std = str(r.get("总部所在区域_标准化") or "").strip()
            print(" -", name, "| std:", std, "| raw:", raw)


if __name__ == "__main__":
    main()

