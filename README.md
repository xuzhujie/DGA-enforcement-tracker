# DGA 执法追踪器（DGA Enforcement Tracker）

一个中文优先、可复核的《数据治理法》（Data Governance Act，Regulation (EU) 2022/868）研究看板。它把三个容易混淆的范围分开：成员国实施程序、数据中介服务登记，以及 DGA Article 31 对非个人数据国际访问/转移的公开信号观察。

## DGA 是什么

DGA 是欧盟的数据治理横向法规，自 2023-09-24 起适用。它围绕公共部门受保护数据再利用、数据中介服务、数据利他组织和 European Data Innovation Board（EDIB）建立数据共享信任机制；Article 31 另涉及在欧盟持有的非个人数据受到第三国政府访问或国际转移时的保障措施。

这不是 DMA/DSA 的平台罚款追踪器：DMA/DSA 的平台指定、罚款和平台执法程序不并入本项目主登记。只有与 DGA 数据中介或非个人数据范围存在研究交叉时，才另列说明。

## 当前看板

- **19 个实施程序事项**：每个成员国一条 reviewed 记录；含 formal notice / reasoned opinion 事件和来源。
- **10 个 reasoned opinion**：截至当前官方 source set 已公开定位到的阶段，不推断后续结案。
- **41 条数据中介登记**：欧委会公开登记册快照；登记不是合规认证、处罚或案件数量。
- **Article 31：未定位到**：当前复核的官方来源中未找到明确将具体公开执法决定系于 Article 31 的个案；这不是“没有案件”的断言。
- **官方动态 feed**：GitHub Actions 只刷新 `public/data/updates.json`，作为待复核信号，不自动改写主登记。

## 项目交付

- `src/data/registry.ts`：人工核验的 typed reviewed registry，保存事项、事件、登记服务、Article 31 观察、来源和复核日期。
- `src/data/metrics.ts`、`src/lib/filters.ts`、`src/lib/export.ts`：指标、筛选和当前视图 JSON/CSV/Markdown 导出。
- `public/data/updates.json`：有界的官方动态 feed；主登记不由脚本自动更新。
- `scripts/check_updates.py`：仅使用 Python 标准库，读取欧委会 Press Corner RSS 和 allowlisted Digital Strategy DGA 页面，筛选 DGA 相关关键词并按链接去重/刷新。
- `public/static/index.html`：适合分享/打印的静态速览页。
- `.github/workflows/deploy.yml`：Node 22、测试、Python 测试、lint、构建并发布 GitHub Pages。
- `.github/workflows/monitor.yml`：每天 UTC 06:17 运行，只有 feed 有变化时才提交 `public/data/updates.json`，并写入 Actions Summary。

## 本地运行

```bash
npm ci
npm run dev
npm test
python3 -m unittest discover -s tests -v
npm run lint
npm run build
```

监测脚本可手动运行：

```bash
python3 scripts/check_updates.py
python3 scripts/check_updates.py --feed-file /path/to/feed.xml --dry-run
```

## 数据和来源政策

主登记只在人工核验官方来源后修改。每条事项/登记服务保留来源 URL、证据摘要和 `last_verified_at`；动态脚本不推断罚款、结案、持续状态或法律结论。

核心来源：

- [EUR-Lex：Regulation (EU) 2022/868](https://eur-lex.europa.eu/eli/reg/2022/868/oj)
- [EUR-Lex：European data governance summary](https://eur-lex.europa.eu/EN/legal-content/summary/european-data-governance.html)
- [欧委会：Data Governance Act explained](https://digital-strategy.ec.europa.eu/en/policies/data-governance-act-explained)
- [欧委会：国家主管机关清单](https://digital-strategy.ec.europa.eu/en/library/national-competent-bodies-and-authorities-under-data-governance-act)
- [欧委会：数据中介服务登记册](https://digital-strategy.ec.europa.eu/en/policies/data-intermediary-services)
- [欧委会：18 个成员国 formal notice](https://digital-strategy.ec.europa.eu/en/news/commission-calls-18-member-states-comply-eu-data-governance-act)
- [欧委会：10 个成员国 reasoned opinion](https://digital-strategy.ec.europa.eu/en/news/commission-calls-10-member-states-comply-data-governance-act)
- [欧委会：爱尔兰 formal notice](https://digital-strategy.ec.europa.eu/en/news/commission-calls-ireland-comply-eu-data-governance-act)

监测只覆盖 Press Corner 当前返回窗口和 allowlisted Digital Strategy 页面中、标题或摘要命中 DGA 关键词的项目；“没有新动态”不等于“没有新案件或程序变化”。同链接页面的标题、摘要或日期变化会刷新 feed，但不会改写主登记。任何新增案件或阶段都应先人工复核原文，再修改 `src/data/registry.ts` 并通过 PR 评审。

## GitHub Pages 与通知

首次部署时，在仓库 Settings → Pages → Source 选择 **GitHub Actions**；如果 Pages 尚未启用，Actions 无法代替账号创建站点，需先完成这一步。推送到 `main` 会触发构建发布；每日监测默认只写 Actions Summary 和 feed 文件。

如需通知，可配置 Actions secret `NOTIFY_WEBHOOK_URL` 与 variable `NOTIFY_WEBHOOK_KIND`（`discord`、`feishu` 或通用 JSON）。通知失败不会阻断 feed 提交。不要把 webhook 地址写进仓库。

## 研究免责声明

本项目仅供研究、合规和事实核查参考，不构成法律意见。日期、程序阶段、登记状态和 Article 31 观察应以最新 EUR-Lex、欧委会、成员国主管机关及法院原文为准。
