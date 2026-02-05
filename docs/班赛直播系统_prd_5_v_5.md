# 班赛直播包装系统 PRD（5v5）

> 目标：为“王者荣耀班赛（5v5）”提供一套可用的在线直播包装系统（BP - 英雄选择/禁用 + 结算 - MVP/本局数据）。系统以“人工后台录入 → 后端广播 → 前端（OBS 浏览器源）展示”为核心模式，确保导播可控、低延迟、易用。

---

## 1. 项目概述

### 1.1 产品名称
班赛直播包装系统（BP + 结算） — 5v5 赛制

### 1.2 背景与目标
- 背景：学校/社团举办王者荣耀班赛，需要在直播中展示标准化的 BP 流程、实时比分、以及赛后 MVP 与关键数据卡，帮助观众理解比赛进程并提升直播专业感。
- 目标：提供一套稳定、易用、低延迟的展示系统，便于导播在 OBS 中作为浏览器源调用；数据由专人（数据员）通过后台人工录入并一键发布。

### 1.3 主要用户
- 导播（OBS 操作员）：使用浏览器源加载展示页面，负责切场景与画面控制。
- 数据员（后台操作员）：录入BP/结算并发布。
- 解说：观看并讲解比赛。
- 观众：通过直播平台观看比赛并接收可视化信息。

---

## 2. 目标与关键指标（KPI）
- **准确率**：发布错误率 < 1%（通过“确认/锁定”机制）
- **实时性**：后台发布到前端显示延迟目标 < 1 秒（本地网络条件）
- **可用性**：导播能在 3 次点击内完成场景切换与页面加载
- **适配性**：页面按 1920×1080 设计，支持 OBS 透明背景输出

---

## 3. 功能概述（MVP）

### 3.1 后台（数据员）
- 登录/权限控制（简单账号）
- 选择/创建赛程（Match）与局数（Game 1/2/3/…）
- BP 编辑：
  - 每队 3 ban（可配置为 3/5）
  - 每队 5 pick（按位置：上/打野/中/射手/辅助）
  - 编辑选手名/队名/队徽
- 发布/锁定 BP（Draft → Publish → Lock）
- 结算编辑：胜方、MVP（选手名 + 英雄 + KDA）、关键数据摘要（输出占比/承伤/参团率）
- 发布结算（Publish Result）
- 历史记录（发布日志）与回滚（撤回到上一已发布状态）

### 3.2 前端（展示页）
- BP 全屏页（供 OBS 浏览器源全屏显示）
- 结算全屏页（MVP 大卡 + 关键数据）
- 小尺寸信息条（Score Ticker，可叠加在比赛画面上）
- 支持 WebSocket 实时更新（或 SSE）
- 支持透明背景输出（用于 OBS 叠加）

### 3.3 后端服务
- REST API（管理操作、获取状态）
- WebSocket 服务（广播 bp_update、result_update、score_update）
- 持久化数据库（Match、GameState、Result、User）

---

## 4. 详细需求

### 4.1 数据字段（建议）
- Match: id, title, best_of（BO3/BO5 可配置）, teamA_id, teamB_id, status
- Team: id, name, logo_url
- GameState（每局）:
  - game_no（局号）
  - bansA[1..3], bansB[1..3]
  - picksA[5]{position, hero, player_name}, picksB[5]
  - locked (bool)
  - published_at
- Result:
  - winner (teamA/teamB)
  - mvp {player, hero, kda}
  - key_stats {damage_share, damage_taken_share, participation}
  - highlight_text
- User: id, username, password_hash, role

### 4.2 后台交互流程
1. 数据员登录 → 选择 Match → 进入 GameNo
2. 在 BP 编辑页编辑 bans/picks（可边操作边预览本地 Draft）
3. 点击“发布” → 后端验证并写 DB → 后端广播 `bp_update`
4. 确认无误后点击“锁定” → 标记局 BP 完成
5. 比赛结束后进入结算页，填写胜方与 MVP → 发布 `result_update`
6. 如需纠错，使用“回滚”功能恢复到上一个已发布状态

### 4.3 前端显示逻辑
- 未发布（Draft）：观众端不显示草稿状态，仅显示占位样式
- 已发布（Published）：展示当前 BP/比分/局数
- 已锁定（Locked）：以视觉标识（文字+图标）提示“已锁定，不能修改”
- 结算发布：自动切换展示结算全屏（或等待导播切场）

---

## 5. UI / 设计原则（给前端/导播的约束）
- 分辨率与布局：优先 1920×1080，字体与元素尺寸需在 OBS 小窗下仍清晰可读
- 颜色：两队主色为红/蓝，胜方高亮用金色/绿色点缀
- 字体：Noto Sans CJK 简体（保证中文显示）
- 透明：提供 `transparent` 参数或 CSS 变量使页面背景透明以便 OBS 叠加
- 可配置性：支持快速切换 3ban / 5ban、BO1/3/5

---

## 6. API 交互（概要）
- `POST /api/login` — 登录
- `GET /api/match/{id}` — 获取 Match 全量信息
- `POST /api/match/{id}/game/{n}/bp` — 更新 Draft BP
- `POST /api/match/{id}/game/{n}/publish` — 发布 BP
- `POST /api/match/{id}/game/{n}/lock` — 锁定 BP
- `POST /api/match/{id}/game/{n}/result` — 发布结算
- WebSocket: `wss://host/ws?match_id=xxx`，服务器广播：`bp_update`, `result_update`, `score_update`

---

## 7. 权限与安全
- 后台登录必需（至少简单账号/密码）
- 发布/锁定/回滚仅限具备权限的用户
- 接口需部署在 HTTPS（OBS 浏览器源建议使用 https）
- 日志记录每次发布操作（操作人、时间、内容摘要）

---

## 8. 交互示例（消息格式）
- bp_update 示例：
```json
{
  "type":"bp_update",
  "game_no":1,
  "teamA":{"name":"红队","bans":["廉颇","梦奇","曜"],"picks":[{"pos":"上","hero":"关羽","player":"张三"},...]},
  "teamB":{...},
  "locked":false,
  "timestamp":"2026-02-05T10:20:00Z"
}
```
- result_update 示例：
```json
{
  "type":"result_update",
  "game_no":1,
  "winner":"teamB",
  "mvp":{"player":"李四","hero":"貂蝉","kda":"9/2/6"},
  "score":{"teamA":0,"teamB":1}
}
```

---

## 9. OBS 集成要求
- 提供三类可供 OBS 加载的 URL：BP 全屏页、结算全屏页、信息条（Ticker）
- 若需透明背景：页面 body 设置透明，OBS 浏览器源勾选“允许透明”
- 建议打开浏览器源硬件加速以保证流畅性

---

## 10. 验收标准（验收测试）
- 功能：BP 发布后所有订阅前端收到 `bp_update` 并正确渲染
- 延迟：本地网络下后台发布到前端渲染平均 < 1s
- UI：在 1920×1080 下无文字溢出，MVP 卡数据正确显示
- 权限：未登录/无权限的用户不能发布/锁定/回滚

---

## 11. 开发与交付（建议计划）
- 1 周：需求确认 + 页面原型（Figma/线框）
- 2 周：前端（BP/Result/Ticker 静态页面） + 后端基础（REST + WS）
- 1 周：后台编辑页（发布/锁定/回滚）
- 1 周：联调、OBS 集成测试、修复
- 交付物：PRD（本 doc）、静态前端原型、后端接口示例、OBS 使用说明、部署脚本

---

## 12. 附：需明确的配置点（请在实施前确认）
- 是否支持 5 ban 或 3 ban（当前为 3 ban）
- BO 几（BO1/3/5，目前设 BO3，可配置）
- 是否需要自动抓取比赛内实时数据（当前为人工录入，若需自动抓取需额外开发）

---

*如果你确认 PRD 内容没问题，我可以继续把“后台字段表单 + 前端页面线框（文字版）”放到同一画布，或者直接产出静态 HTML/CSS/JS 原型。你希望接下来我把哪一项放到画布里？*

