# Server Log Dashboard

## 简介 (Chinese)

这是一个简单的服务器日志面板，用于查看与筛选日志，并展示基础统计信息。

### 运行

```bash
npm run dev
```

打开浏览器访问：http://localhost:3000

### 说明

- 日志页面：/logs
- 后端接口：/api/logs

### 日志获取方式

- 前端请求 /api/logs?file=WeifanWrt_backup.log （可以添加多个log）
- 后端通过 SSH 连接到服务器，读取映射的远程日志文件
- 文件名与远程路径在 app/api/logs/route.ts 中配置
- 需要配置环境变量：SSH_HOST、SSH_PORT、SSH_USER、SSH_PRIVATE_KEY

---

## Overview (English)

This is a simple server log dashboard to view and filter logs with basic stats.

### Run

```bash
npm run dev
```

Open http://localhost:3000

### Notes

- Logs page: /logs
- API endpoint: /api/logs

### How logs are fetched

- Frontend requests /api/logs?file=WeifanWrt_backup.log (can add multiple logs)
- The API connects to the server via SSH and reads the mapped remote log file
- Filename-to-remote-path mapping is configured in app/api/logs/route.ts
- Required env vars: SSH_HOST, SSH_PORT, SSH_USER, SSH_PRIVATE_KEY
