import json
from pathlib import Path

import pandas as pd


def main() -> None:
    src_path = Path("cango-global result.xlsx")
    if not src_path.exists():
        raise FileNotFoundError(f"未找到 Excel 文件: {src_path}")

    xls = pd.ExcelFile(src_path)

    data = {}
    for sheet in xls.sheet_names:
        df = xls.parse(sheet)
        # 使用 records 形式导出，每一行是一个字典（列名 -> 值）
        data[sheet] = df.to_dict(orient="records")

    out_path = Path("cango-global result.json")
    with out_path.open("w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"已导出为 JSON: {out_path}")


if __name__ == "__main__":
    main()

