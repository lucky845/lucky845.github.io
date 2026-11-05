export interface Project {
  name: string
  href: string
  description: string
  tags: string[]
  /** 标记线上可以直接试用的项目 */
  live?: boolean
}

export const projects: Project[] = [
  {
    name: 'deepseek-monitor',
    href: 'https://monitor.lucky845.top/',
    description:
      'DeepSeek 余额与用量的跨平台监控面板，一套 Flutter 代码覆盖六个平台，桌面端带小组件。不登录也能用示例数据把界面点一遍，接上账号数字才变真 —— 每块数据都标明自己是真实还是示例。',
    tags: ['Dart', '六端'],
    live: true,
  },
  {
    name: 'frontend-toolbox',
    href: 'https://frontend-toolbox.lucky845.top/',
    description:
      '23 个开发小工具，按文本、编码、数据格式化、开发辅助、图像、对比分成六块，从 Base64、JSON 格式化一直到图片压缩加水印。刻意做成纯前端：所有处理都在浏览器本地完成，没有后端可以上传，隐私是架构决定的，不是承诺出来的。',
    tags: ['React', 'Vite', 'Tailwind'],
    live: true,
  },
  {
    name: 'easy-captcha',
    href: 'https://github.com/lucky845/easy-captcha',
    description:
      'Spring Boot starter 形式的验证码生成器。加一行 Maven 依赖、写几行配置就能用，支持数字、字符、图形、算术等多种类型，以 Base64 返回便于前端直接展示。',
    tags: ['Java', 'Spring Boot'],
  },
  {
    name: 'github-profile-statistics-card',
    href: 'https://github.com/lucky845/github-profile-statistics-card',
    description:
      '把 GitHub、LeetCode、CSDN、掘金、B 站的统计数据渲染成一张 SVG 卡片，直接挂进个人主页 README。带 Redis 多级缓存与 Prometheus 监控，输出前过滤 SVG 内容防 XSS。',
    tags: ['TypeScript', 'SVG', 'Redis'],
  },
  {
    name: 'AnimeTimeline',
    href: 'https://github.com/lucky845/AnimeTimeline',
    description:
      '抓番剧放送表整理成 Markdown，可按年和按月取数。每天 8 点（北京时间）自动增量同步并去重，网络异常重试三次，更新结果由 GitHub Actions 归档成带版本的 PR。',
    tags: ['Python', '爬虫', 'Actions'],
  },
  {
    name: 'ts-tetris-game',
    href: 'https://github.com/lucky845/ts-tetris-game',
    description:
      'TypeScript 加 HTML5 Canvas 写的俄罗斯方块，复古游戏机配色。带下一块预览、等级越高越快、暂停续玩，用 Bun 起开发环境。',
    tags: ['TypeScript', 'Canvas', 'Bun'],
  },
  {
    name: 'group-avatar-generator',
    href: 'https://github.com/lucky845/group-avatar-generator',
    description:
      '上传几张图自动拼成微信群里那种九宫格头像。不足九张会随机补足，尺寸、边框、颜色都能调，生成后直接下载 PNG。',
    tags: ['TypeScript', '工具'],
  },
  {
    name: 'ouchn-course-brusher-script',
    href: 'https://github.com/lucky845/ouchn-course-brusher-script',
    description:
      '面向国家开放大学实验学院 Moodle 平台的油猴脚本，用 Vue 3 与 TypeScript 写到 v2.2.5。自动识别学习项目并追踪进度，带三档速度、防息屏、模拟真人滚动，刷新页面不丢进度。',
    tags: ['TypeScript', '油猴'],
  },
  {
    name: 'daily-commit-bot',
    href: 'https://github.com/lucky845/daily-commit-bot',
    description:
      '演示怎么用 GitHub Actions 做每日自动提交：定时往日志文件追加一行时间戳并提交，月初自动清空日志，也能手动触发。',
    tags: ['Shell', 'Actions'],
  },
]
