# Contributing to the DGA tracker

本项目是官方来源优先的研究登记，不是自动生成的法律结论。任何数据更新都应保留“事实是什么、来自哪里、复核到哪一天、目前没有证明什么”四个层次。

## 人工复核流程

1. 从 Actions 的 DGA official update monitor、欧委会 DGA 页面、EUR-Lex、成员国主管机关页面或法院材料开始。
2. 打开原始官方来源，确认成员国、事项/组织名称、日期、INFR 号、程序阶段或登记状态；不要只依据 RSS 标题。
3. 更新 `src/data/registry.ts` 中对应的 typed record，同时保留 `sources`、证据摘要和 `last_verified_at`。
4. 对结案、升级、法院转交和 Article 31 个案，必须有明确指向该事项的官方原文；没有明确证据时使用 `not_located` / “未定位到”，不能写成 `closed`、`0` 或“没有案件”。
5. 在本地运行：

   ```
   npm ci
   npm test
   npm run validate:data
   python3 -m unittest discover -s tests -v
   npm run lint
   npm run build
   ```

6. 提交 PR，填写 `.github/PULL_REQUEST_TEMPLATE.md` 的来源、范围和语义检查清单。主登记的变化应由人工评审后合并。

## 自动化边界

- `scripts/check_updates.py` 只能写 `public/data/updates.json`，不会自动修改主登记。
- `npm run validate:data` 检查 ID、来源 URL、复核日期、关联关系和 Article 31 空值语义。
- 部署 workflow 会在 Pages 发布前运行数据校验。
- Webhook 只发送监测摘要；通知目标必须通过 GitHub Actions secret 提供，不能写入仓库。
