# lucky845.github.io

[lucky845.top](https://lucky845.top/) 个人主页的源码。Vite + Vue 3 + TypeScript 写成，构建产物由 GitHub Actions 发布到 GitHub Pages。

页面没有外部依赖：不加载第三方字体、CDN 脚本或统计服务，动效用原生 CSS 与 Canvas。

## 本地开发

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # 产物输出到 dist/
npm run preview   # 预览构建产物
```

需要 Node 20 或更新。

## 目录结构

```
index.html                 入口，SEO 元信息、canonical、JSON-LD、favicon
public/                    原样拷进 dist：CNAME（lucky845.top）、.nojekyll
src/
  main.ts                  挂载应用；首帧前决定是否启用入场动效
  App.vue                  页面骨架，负责区块进场动效的触发与 3 秒兜底
  components/
    TopBar.vue             顶栏，滚动后加阴影
    HeroSection.vue        首屏标题、简介、两个按钮
    ScopeCanvas.vue        首屏示波器：三条信号通道 + 刻度网格 + 扫描光点
    ReadoutPanel.vue       站点档案读数面板，进视口后数字滚到目标值
    StackBars.vue          技术栈条形图，进视口才生长
    ProjectList.vue        项目列表
    LinkSection.vue        链接区块，「写下来的东西」与「在别处」复用
    SiteFooter.vue         页脚
  composables/
    useInView.ts           元素首次进入视口即置真，之后不再翻转
  data/                    页面上的数字和文案都在这里，改内容只动这几个文件
    site.ts                站点信息、档案五行、技术栈十项、文案里的笔记篇数
    projects.ts            九个项目
    links.ts               笔记入口与「在别处」
  styles/global.css        全部样式，设计 token 定义在 :root
```

## 改内容

| 想改什么 | 改哪里 |
| --- | --- |
| 档案里的数字、站点信息 | `src/data/site.ts` |
| 技术栈条目与计数 | `src/data/site.ts` |
| 项目列表、描述、标签 | `src/data/projects.ts` |
| 笔记入口与联系方式 | `src/data/links.ts` |
| 配色、字号、间距、断点 | `src/styles/global.css` 的 `:root` 与各区块规则 |
| 标题、描述、og、JSON-LD | `index.html` |

文章更新后，笔记篇数、分类数、标签数由构建前的 `scripts/fetch-stats.mjs` 自动从博客拉取，不需要手改；只有 `index.html` 的 `meta description` 里写死的篇数要手动跟进。

## 动效约定

- **首屏内容不依赖动画出现。** 动效只在 `<html>` 带 `js-anim` 类时启用，这个类由 `src/main.ts` 在「JS 可用、浏览器支持 IntersectionObserver、用户未要求减少动效」三条都满足时添加。
- 无 JS、`prefers-reduced-motion: reduce`、打印时页面完整可见；canvas 在减少动效时只画一帧静态波形。
- `App.vue` 有 3 秒兜底：观察器失灵时强制显示所有区块，不让内容困在透明里。
- 截图验证时用 `--force-prefers-reduced-motion`，看到的就是减少动效用户的观感。

## 部署

推 `master` 触发 `.github/workflows/deploy.yml`：

1. `npm ci` → `npm run build`
2. `actions/upload-pages-artifact` 上传 `dist/`
3. `actions/deploy-pages` 发布

Pages 的 source 设为 **GitHub Actions**（`build_type=workflow`），自定义域名 `lucky845.top` 由 `public/CNAME` 随产物带上去，不需要在 GitHub 后台手填。

回滚：`git revert` 对应提交再推一次，Actions 会重新发布上一个版本。

## 数据口径

笔记 146 篇、分类 23 个、标签 209 个、公开项目 9 个、归档 13 页，取自博客侧栏统计与 GitHub 仓库列表；技术栈十项是该博客标签的真实计数。
