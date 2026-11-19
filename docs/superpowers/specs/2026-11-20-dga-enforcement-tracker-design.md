# DGA Enforcement Tracker 设计稿

## Intent

搭建一个中文优先、官方来源优先的《数据治理法》（Data Governance Act，DGA）实施与执法追踪器。它服务于合规、政策和法务团队，回答四个问题：DGA 是什么、哪些成员国出现了欧委会实施程序、哪些数据中介服务已被通知/登记、非个人数据国际访问/出境的公开监管信号在哪里。

本项目不是把 DGA 强行做成 DMA/DSA 式罚款榜单。DGA 的公开监管信号分为三条轨道，并在产品上分开统计：

1. **实施/执法程序**：欧委会针对成员国未指定或未充分授权主管机关的 infringement procedure。
2. **数据中介服务**：欧委会维护的公开登记册及成员国通知信息。
3. **非个人数据国际访问/出境**：DGA 第 31 条的法律保障与公开个案监测；当前 reviewed source set 未定位到可核验的公开 DGA 执法决定时，显示 `未定位到`，不显示为 0。

## DGA 是什么

DGA 是 Regulation (EU) 2022/868，即 Regulation on European data governance。它自 2023 年 9 月 24 日起适用，核心不是监管大型平台，而是建立可信的数据共享治理框架：允许在有条件的情况下复用公共部门持有的受保护数据，约束数据中介服务的中立性与通知机制，支持数据利他组织，并通过 European Data Innovation Board 协调成员国实践；第 31 条还针对在欧盟持有的非个人数据，设置第三国政府访问/转移可能与欧盟或成员国法律冲突时的保障措施。

与邻近项目的边界在 UI 中明确写出：

| 法规 | 主要对象 | 典型监管信号 |
| --- | --- | --- |
| DMA | 守门人和核心平台服务 | 欧委会调查、不合规决定、罚款、整改 |
| DSA | 在线中介、平台和 VLOP/VLOSE | 欧委会/DSC 程序、信息请求、决定、罚款、整改 |
| DGA | 数据共享治理、数据中介、数据利他和公共部门数据复用 | 成员国主管机关实施程序、服务通知/登记、数据利他注册、非个人数据国际访问保障 |

## Goals

- 提供首屏可读的 DGA 定义、范围边界和当前公开信号摘要。
- 将 2024 年欧委会公开的 18 个 letter of formal notice、后续 10 个 reasoned opinion，以及随后公开的爱尔兰 letter of formal notice，建成可筛选的成员国事项登记。
- 将欧委会公开的数据中介服务登记册作为独立数据对象，保留国家、服务提供方名称和官方来源，不把登记数当作执法案件数。
- 将 DGA 第 31 条非个人数据国际访问/出境作为独立监管观察面，清晰区分法律规则、监测状态与实际公开个案。
- 复用 DMA/DSA 的交付方式：本地 `npm run dev`、`npm test`、`npm run lint`、`npm run build`；GitHub Pages 部署；GitHub Actions 官方动态监测；README、静态速览页和导出功能。
- 每条事实保留来源 URL、来源类型、证据摘要和 `last_verified_at`，支持后续人工复核或迁移到数据库/API。

## Non-goals

- 不把 DGA 与 DMA、DSA、Data Act 的义务混为一谈。
- 不把数据中介登记册条目计入罚款、案件或 infringement procedure 总数。
- 不根据新闻抓取结果自动修改案件阶段、主管机关、处罚金额或法律结论。
- 不声称当前 source set 之外没有案件；“未定位到”仅表示本次复核范围内没有可核验记录。
- v1 不接入内部案件系统或数据库，不提供法律意见，不做预测性风险评分。

## Anti-goals

- 不制作只有 KPI 卡片、没有事实记录和来源的“监管热度”页面。
- 不用 0 表示缺失、未知或未找到的处罚/案件数量。
- 不把“数据中介服务”与“在线平台中介”混称为同一种法律对象。
- 不让 RSS/Press Corner 噪声直接变成新的案件事实或改变现有案件状态。

## Scope and seed evidence

首版以官方来源为主，数据截止与逐条复核日期使用 `2026-11-20`，并在 UI 中显示。首版数据包括：

- **实施程序主登记**：19 个成员国事项；18 个成员国来自 2024-05-23 formal notice，爱尔兰来自单独的 2024 年 formal notice；其中 10 个在 2024-12-16 公开进入 reasoned opinion 阶段。每个成员国一条主记录，每条记录同时保存阶段事件，避免按新闻条数重复计数。
- **数据中介服务登记**：按欧委会公开页面的当前列表快照整理，包含奥地利、比利时、芬兰、法国、德国、匈牙利、爱尔兰、荷兰、西班牙、瑞典等国家的公开服务名称；页面快照当前共 41 个服务条目。该统计是登记册覆盖量，不是处罚或违规数。
- **非个人数据国际访问/出境观察**：保存 Article 31 的法律规则、官方原文和 `not_located` 监测记录。若后续发现具体官方案件，新增独立事件，不覆盖法律规则记录。
- **法规时间线**：DGA 通过、适用日期、2024-05-23 formal notice、爱尔兰 formal notice、2024-12-16 reasoned opinions、2025-07-08 DGA evaluation consultation、2025-09-24 既有数据中介过渡合规节点、最近一次人工复核。

## Chosen approach

### A. 采用：沿用 DMA/DSA 的 typed local registry + official update monitor

使用 React 19 + TypeScript + Vite + `lucide-react` + 原生 CSS；案件、事件、登记、法律条款、来源和复核信息放在 `src/data/` 的类型化本地登记中。`public/data/updates.json` 只承载官方动态 feed，脚本和 GitHub Actions 负责刷新；主数据仍需人工核验后修改。选择它是因为当前工作区为空，但相邻项目已有稳定的交付方式，且用户已明确要求参考它们的交付。

### B. 不采用：先接数据库/API

未来可以把数据层迁移到 SQLite/Postgres 或 API，但当前没有内部数据、认证、字段契约或部署目标。直接接 API 会增加依赖和不可验证的空壳，不利于首版交付。

### C. 不采用：纯静态 HTML/报告

纯静态报告无法满足案件筛选、登记册分栏、时间线、导出、双语切换和后续动态监测要求。仍保留 `public/static/index.html` 作为打印/分享速览页，但不作为主应用。

## Information architecture

主导航：

- **驾驶舱**：DGA 定义/边界、四个关键指标、待复核事项、数据新鲜度、最近动态。
- **实施程序**：19 个成员国事项登记，按阶段、国家、INFR 号、最新公开信号筛选。
- **数据中介**：公开服务登记册，按国家和服务名称筛选；明确标注“登记，不等于处罚”。
- **非个人数据出境**：Article 31 规则、已定位/未定位的公开个案观察、第三国访问风险的证据入口。
- **时间线**：法规和公开程序里程碑，按日期倒序。
- **来源**：EUR-Lex、欧委会 DGA 页面、数据中介登记册、成员国主管机关列表及各类 press release。

全局控制：语言切换（中文/English）、轨道、国家、阶段、年份、关键词、清除筛选、导出当前筛选视图（JSON/CSV/Markdown）。

## Data model

核心对象：

- `DgaMatter`：`matter_id`、标题、轨道、国家、`infr_number`、阶段、最新公开信号、状态说明、首次日期、最新日期、法律依据、业务/合规影响、下一步、来源、`last_verified_at`。
- `MatterEvent`：日期、事件类型、事件说明、来源；用于 formal notice → reasoned opinion 等阶段链。
- `IntermediaryRecord`：国家、服务名称、登记/通知标签、来源、`last_verified_at`。
- `NonPersonalTransferWatch`：法律条款、规则摘要、监测状态（`located` / `not_located` / `needs_review`）、观察范围、来源。v1 监测范围限定为 2023-09-24 至 2026-11-20 的欧委会 DGA 页面、EUR-Lex DGA 文本/摘要、官方侵权程序新闻、官方数据中介登记册和官方主管机关清单；只有官方来源明确指向 DGA Article 31 的具体非个人数据国际访问/转移行动或决定时，才标记为 `located`。
- `SourceRef`：显示名称、URL、来源类型、证据快照、最后复核日期。
- `UpdateItem`：由官方 RSS/页面监测生成，不修改 `DgaMatter`。

状态语义：

- `formal_notice` / `reasoned_opinion` 是公开程序阶段，不等同于最终违规决定或罚款。
- `registered` 是公开登记册状态，不等同于合规认证或执法结论。
- `not_located` 是当前 reviewed source set 没有找到记录，不是 0，也不是“没有发生”。证据保存 live URL、短证据摘要和 `last_verified_at`，不复制整篇法规或新闻正文。
- `pending_review` 表示需要人工复核或等待后续官方来源；不显示确定性法律结论。

## Delivery and operations

- `README.md`：双语项目说明、DGA 是什么、范围、来源政策、数据模型、运行命令、自动监测边界、GitHub Pages 设置、研究用途免责声明，并说明主登记册由维护者人工复核后通过 pull request 发布。
- `.github/workflows/deploy.yml`：`npm ci` → `npm test` → `npm run lint` → `npm run build` → Pages artifact → deploy。
- `.github/workflows/monitor.yml`：每日 UTC 定时运行 `scripts/check_updates.py`，抓取官方 Press Corner / Digital Strategy feed，只有数据变化才提交 `public/data/updates.json`，写入 Actions Summary，可选 Webhook 通知。
- `scripts/check_updates.py`：只抓官方动态 feed，按 `data governance act`、`DGA`、`data intermediation`、`data altruism`、`non-personal data` 等关键词过滤，不覆盖主登记册。
- `public/static/index.html`：不依赖 React 的最新静态速览页，至少包含 DGA 定义、关键数字、实施程序阶段和官方来源入口。
- 导出：浏览器端生成当前筛选结果的 JSON、CSV、Markdown；不写后端、不上传本地数据。

## Visual and interaction direction

沿用 DSA 的高密度研究工具骨架：白色内容面板、深蓝标题带、蓝色筛选控制、明确的状态标签和细边框；不做营销型 hero。首屏先回答“DGA 是什么/现在有什么公开信号”，再进入表格和时间线。数据中介和非个人数据出境使用独立色带/标签，避免与实施程序混淆。窄屏上表格使用容器内横向滚动或堆叠，页面本身不得出现横向溢出。

## Acceptance criteria

- 页面首屏能看到 DGA 定义、与 DMA/DSA 的边界、19 个实施程序事项、10 个 reasoned opinion、41 个登记服务和 Article 31 的 `未定位到` 状态。
- “数据中介”与“非个人数据出境”均有独立导航/筛选/登记，不计入实施程序或罚款指标。
- 19 个成员国事项可按国家、阶段、轨道和关键词筛选；每条记录有官方来源和复核日期。
- 非个人数据出境视图把 Article 31 规则与公开个案分开；未定位记录显示 `未定位到`，不得显示为 0。
- DGA 定义、案件阶段和数据中介登记数量均有官方链接；页面文字明确“研究参考，不构成法律意见”。
- `npm test`、`npm run lint`、`npm run build` 通过；至少测试指标派生、阶段计数、去重和 `not_located` 语义。
- GitHub Pages workflow 包含安装、测试、lint、构建和部署；monitor workflow 只更新动态 feed，不自动改写主登记。
- 浏览器验证覆盖首屏、筛选、详情展开、语言切换、导出、窄屏无横向溢出和静态速览页。

## Open implementation calls

- 使用中文优先，英文作为可切换界面；官方机构名、法规名、INFR 号和服务名称保留英文/原文。
- 19 个成员国事项按成员国一条主记录建模，阶段变化放入事件；避免把一篇新闻误计为多个案件，也避免把 10 个 reasoned opinions 合并成不可筛选的一条记录。
- 当前日期使用客户端时间上下文的 `2026-11-20`；来源页面未来变化时，数据文件中的 `last_verified_at` 需随人工复核更新。
- 数据中介登记册保留来源快照的服务名称；若官方登记册变化，以新快照替换并在更新说明中标记变化，不把旧服务默认为撤销。
