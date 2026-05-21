# 本地预览

以后修改 `index.html`、`cango-heatmap.js`、`sphere-wordcloud.js` 或其他前端文件时，可以先在本地预览，不需要马上推送到 GitHub。

## 启动方式

在项目根目录运行：

```powershell
powershell -ExecutionPolicy Bypass -File .\start-local-preview.ps1
```

然后打开：

```text
http://localhost:4173/
```

保持这个 Terminal 窗口打开。修改文件并保存后，浏览器会自动刷新。

## 停止方式

回到运行预览服务的 Terminal，按：

```text
Ctrl+C
```

## 如果提示没有 Node.js

先安装 Node.js：

```powershell
winget install -e --id OpenJS.NodeJS.LTS
```

安装完成后，重新打开 Terminal，再运行启动命令。

