# CANGO 数据更新与质检流程

用于把 Excel 原始数据更新到静态看板，并在发布前确认数据可信度。

## 1. 重新生成站点数据

在项目根目录运行：

```powershell
& "C:\Users\dsy77\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" build_site_data.py
```

脚本会依次更新：

- `cango-global result.json`
- `cango-global result.xlsx`
- `data.json`
- `cango-data-lite.js`
- `index.html` 内的统计常量
- `data-quality-report.md`

## 2. 查看质检报告

打开 `data-quality-report.md`，优先处理：

- `重点排查`：发布前优先人工核对的 `ERROR` 问题，通常是疑似串行或关键口径错误。
- `ERROR`：数量口径、区域映射、重复名称、疑似串行字段。
- `WARN`：关键字段缺失、官网/邮箱/电话格式异常、合作状态混入长说明。
- `INFO`：共享邮箱/官网、泛化联系人等提示项。

当前重点关注字段：

- `statusNote`
- `cooperationStatus`
- `cooperationNotes`
- `website`
- `contactName`
- `contactTitle`
- `email`
- `phone`

如果报告提示 `statusNote` 提到其他机构或出现不匹配域名，先回到 Excel 对应行人工核对，再重新运行生成脚本。

## 3. 发布前本地预览

启动本地预览：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local-preview.ps1
```

打开：

```text
http://localhost:4173/
```

发布前至少确认：

- 机构发现中心显示 `203 / 203`。
- 严格大洲分布：欧洲 95、亚洲 69、北美 28、南美/拉美 4、非洲 4、大洋洲 3。
- 亚洲子区域：东亚 42、东南亚 19、南亚 4、中亚 2、中东 2。
- 搜索、筛选、清空筛选正常。
- 点击任意卡片“查看详情”可打开详情面板。
- 抽样 10-15 家机构，确认运营状态说明、合作说明、联系人、官网没有明显串行。

## 4. 单独运行质检

如果只是想重新生成质检报告，不重建 Excel 数据：

```powershell
& "C:\Users\dsy77\.cache\codex-runtimes\codex-primary-runtime\dependencies\python\python.exe" data_quality.py
```
