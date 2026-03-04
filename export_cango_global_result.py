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


def normalize_region(r) -> str:
    """将各种写法的区域名称归并到统一的大洲标签。"""
    r = "" if r is None else str(r)
    if "欧洲" in r or "Europe" in r:
        return "欧洲"
    if "亚洲" in r or "Asia" in r:
        return "亚洲"
    if "北美" in r or "North America" in r:
        return "北美"
    if "南美" in r or "Latin America" in r or "South America" in r or "拉美" in r:
        return "南美/拉美"
    if "非洲" in r or "Africa" in r:
        return "非洲"
    if "大洋洲" in r or "澳洲" in r or "Oceania" in r:
        return "大洋洲"
    if "中亚" in r:
        return "中亚"
    if "中东" in r or "Middle East" in r:
        return "中东"
    return r or "其他"


def main() -> None:
    src_path = Path("【汇总表】CANGO海外资源库-数据清洗 2026.02 更新.xlsx")
    xls = pd.ExcelFile(src_path)

    # 1. 锁定 “CANGO海外资源库” 子页面
    sheet_name = None
    for s in xls.sheet_names:
        if "CANGO" in s and "海外" in s:
            sheet_name = s
            break

    if sheet_name is None:
        raise ValueError("未找到名为 CANGO海外资源库 的工作表")

    # 2. 获取 DataFrame 和机构名称列
    df, name_col = detect_header_and_name_col(xls, sheet_name)
    if df is None or name_col is None:
        raise ValueError("未能在 CANGO海外资源库 中自动识别机构列")

    # 3. 规范化机构名称
    name_norm = (
        df[name_col]
        .astype(str)
        .str.replace("\u3000", "", regex=False)
        .str.strip()
    )

    # 4. 识别“总部所在区域（大洲）”列
    region_col = None

    # 4.1 先看列名
    for c in df.columns:
        col_text = str(c)
        if any(k in col_text for k in ("大洲", "所在区域", "所在地区", "总部", "洲")):
            region_col = c
            break

    # 4.2 如果列名不明显，再根据内容猜
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
            "中亚",
            "中东",
            "North America",
            "South America",
            "Latin America",
            "Africa",
            "Asia",
            "Europe",
            "Oceania",
        ]
        pattern = "|".join(continent_keywords)
        for c in df.columns:
            s = df[c].astype(str)
            if s.str.contains(pattern, regex=True, na=False).any():
                region_col = c
                break

    if region_col is None:
        raise ValueError("未找到包含大洲/区域信息的列")

    region_raw = df[region_col].astype(str).str.strip()
    region_norm = region_raw.apply(normalize_region)

    # 5. 只保留机构名和区域都非空的记录
    mask_valid = name_norm.ne("") & region_norm.ne("")
    df_valid = df.loc[mask_valid].copy()
    df_valid["机构名称_标准化"] = name_norm[mask_valid]
    df_valid["总部所在区域_标准化"] = region_norm[mask_valid]

    # 6. 根据标准化机构名称去重（即 205 家唯一机构）
    df_unique = (
        df_valid
        .sort_values(["机构名称_标准化", "总部所在区域_标准化"])
        .drop_duplicates(subset=["机构名称_标准化"])
    )

    # 7. 写入新的 Excel，包含一个总页面 + 各大洲子页面
    out_path = Path("cango-global result.xlsx")
    with pd.ExcelWriter(out_path, engine="openpyxl") as writer:
        # 7.1 机构总页面：所有唯一机构
        df_unique.to_excel(writer, sheet_name="机构总表", index=False)

        # 7.2 各大洲分页面
        for region in sorted(df_unique["总部所在区域_标准化"].unique()):
            sub = df_unique[df_unique["总部所在区域_标准化"] == region]
            # sheet 名：只用大洲简短中文名，避免 / 等非法字符
            sheet = str(region).replace("/", "")
            if not sheet:
                sheet = "其他"
            sub.to_excel(writer, sheet_name=sheet[:31], index=False)

    print(f"结果已保存为: {out_path}")


if __name__ == "__main__":
    main()

