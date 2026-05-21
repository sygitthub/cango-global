import pandas as pd
from pathlib import Path


def detect_header_and_name_col(xls: pd.ExcelFile, sheet: str):
    """自动识别表头行，并找到包含“机构/单位”的列。"""
    tmp = xls.parse(sheet, header=None)

    header_row_idx = None
    for i, row in tmp.head(30).iterrows():
        for v in row:
            if isinstance(v, str) and any(k in v for k in ("机构名称", "机构", "单位")):
                header_row_idx = i
                break
        if header_row_idx is not None:
            break

    if header_row_idx is None:
        return None, None

    df = xls.parse(sheet, header=header_row_idx)

    name_col = None
    for c in df.columns:
        text = str(c)
        if any(k in text for k in ("机构名称", "机构", "单位")):
            name_col = c
            break

    return df, name_col


def main() -> None:
    file_path = Path("【汇总表】CANGO海外资源库-数据清洗 2026.02 更新.xlsx")
    xls = pd.ExcelFile(file_path)

    # 精确锁定“CANGO海外资源库”这个子页面
    sheet_overseas = None
    for s in xls.sheet_names:
        if "CANGO" in s and "海外" in s:
            sheet_overseas = s
            break

    if sheet_overseas is None:
        print("ERROR: 未找到名为 CANGO海外资源库 的工作表")
        return

    df, name_col = detect_header_and_name_col(xls, sheet_overseas)
    if df is None or name_col is None:
        print("ERROR: 未能在 CANGO海外资源库 中自动识别机构列")
        return

    # 规范化“机构名称”
    name_series = (
        df[name_col]
        .astype(str)
        .str.replace("\u3000", "", regex=False)  # 去掉全角空格
        .str.strip()
    )

    # 自动识别“总部所在区域（大洲）”列：
    # 1）优先根据列名中的关键字判断
    region_col = None
    for c in df.columns:
        col_text = str(c)
        if any(k in col_text for k in ("大洲", "所在区域", "所在地区", "总部", "洲")):
            region_col = c
            break

    # 2）如果列名判断失败，则根据单元格内容里是否出现大洲名称来猜测
    if region_col is None:
        continent_keywords = [
            "亚洲",
            "非洲",
            "欧洲",
            "北美",
            "南美",
            "拉美",
            "大洋洲",
            "澳洲",
            "中东",
            "North America",
            "South America",
            "Latin America",
            "Africa",
            "Asia",
            "Europe",
            "Oceania",
        ]
        for c in df.columns:
            s = df[c].astype(str)
            if s.str.contains("|".join(continent_keywords), regex=True, na=False).any():
                region_col = c
                break

    if region_col is None:
        print("ERROR: 未找到包含大洲/区域信息的列")
        return

    region_series = df[region_col].astype(str).str.strip()

    # 只保留“机构名称”和“总部所在大洲”都非空的记录
    mask_valid = name_series.ne("") & region_series.ne("")
    names_valid = name_series[mask_valid]
    regions_valid = region_series[mask_valid]

    # 按大洲统计唯一机构数量
    stats = (
        pd.DataFrame({"region": regions_valid, "name": names_valid})
        .groupby("region")["name"]
        .nunique()
        .sort_values(ascending=False)
    )

    print("SHEET_NAME", sheet_overseas)
    print("INSTITUTION_COL", name_col)
    print("REGION_COL", region_col)
    print("TOTAL_UNIQUE_INSTITUTIONS", names_valid.nunique())
    print("UNIQUE_INSTITUTIONS_BY_REGION:")
    for region, cnt in stats.items():
        print(f"{region}\t{cnt}")


if __name__ == "__main__":
    main()

