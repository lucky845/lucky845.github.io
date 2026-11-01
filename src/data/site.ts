export const site = {
  name: 'lucky845',
  role: '后端工程师，也做全栈和运维',
  blog: 'https://blog.lucky845.top/',
  github: 'https://github.com/lucky845',
  email: 'mailto:1447545564@qq.com',
  sourceRepo: 'https://github.com/lucky845/lucky845.github.io',
} as const

/** 站点档案面板上的一行读数 */
export interface Stat {
  label: string
  value: number
  unit: string
}

/** 数字取自博客统计与 GitHub，改动文章后要同步这里 */
export const stats: Stat[] = [
  { label: '笔记', value: 137, unit: '篇' },
  { label: '分类', value: 23, unit: '个' },
  { label: '标签', value: 172, unit: '个' },
  { label: '公开项目', value: 8, unit: '个' },
  { label: '归档', value: 12, unit: '页' },
]

/** 档案面板右上角的时间戳 */
export const statsStamp = '2026-11'

/** 首页文案里引用的笔记篇数 */
export const noteCount = 137
