import pandas as pd
from pathlib import Path


def detect_header_and_name_col(xls: pd.ExcelFile, sheet: str):
    """
    在指定 sheet 中自动定位表头行，并尝试找到包含“机构”/“单位”的列。
    返回 (DataFrame, 机构列名或 None)。
    """
    # 不指定表头，先把前几行都读进来，用于扫描表头
    tmp = xls.parse(sheet, header=None)

    header_row_idx = None
    name_col = None

    # 扫描前 30 行，寻找包含“机构名称”/“机构”/“单位”的单元格作为表头
    for i, row in tmp.head(30).iterrows():
        for v in row:
            if isinstance(v, str) and any(key in v for key in ("机构名称", "机构", "单位")):
                header_row_idx = i
                break
        if header_row_idx is not None:
            break

    if header_row_idx is None:
        # 找不到表头，直接返回 None
        return None, None

    # 以检测到的行作为表头重新读一次
    df = xls.parse(sheet, header=header_row_idx)

    # 再从列名中找“机构名称”/“机构”/“单位”
    for c in df.columns:
        text = str(c)
        if any(key in text for key in ("机构名称", "机构", "单位")):
            name_col = c
            break

    return df, name_col


def main() -> None:
    file_path = Path("【汇总表】CANGO海外资源库-数据清洗 2026.02 更新.xlsx")
    print("文件存在:", file_path.exists())

    xls = pd.ExcelFile(file_path)
    print("工作表列表:", xls.sheet_names)

    for sheet in xls.sheet_names:
        df, name_col = detect_header_and_name_col(xls, sheet)

        if df is None or name_col is None:
            print(f"\n=== Sheet: {sheet} ===")
            print("未能自动识别表头或机构列。")
            continue

        # 如果误把表头当成数据行，通常会出现 “单元格内容 == 列名” 的情况，这里做一次清洗
        col_name_str = str(name_col).strip()
        series = df[name_col].astype(str).str.strip()
        df_clean = df[series.ne(col_name_str)]

        unique_count = df_clean[name_col].dropna().nunique()

        # 粗略判断境内 / 海外
        label = "unknown"
        if "海外" in sheet or "境外" in sheet:
            label = "overseas"
        elif "境内" in sheet or "国内" in sheet:
            label = "domestic"

        print(f"\n=== Sheet: {sheet} ===")
        print("机构相关列:", name_col)
        print("唯一机构数量(清洗后):", unique_count)
        print("总行数:", len(df_clean))
        print("类型判断:", label)


if __name__ == "__main__":
    main()

