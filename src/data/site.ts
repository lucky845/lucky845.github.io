/**
 * 站点档案与「笔记里的技术栈」两块数字。
 *
 * 这些数字不再手工维护：构建前 scripts/fetch-stats.mjs 会去博客抓
 * stats.json 覆盖同目录的 blog-stats.json，这里只负责把「博客口径」
 * 翻译成主页的展示结构。
 *
 * 注意 blog-stats.json 一定存在 —— fetch-stats.mjs 在抓取失败时会
 * 写入仓库里上一次成功的缓存，连缓存都没有才写兜底值。
 * 所以这里可以放心用静态 import，不需要运行时判断文件在不在。
 */
import raw from './blog-stats.json'

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

/** 一条标签的计数 */
export interface StackItem {
  name: string
  count: number
}

/** 博客构建时产出的结构 */
interface BlogStats {
  posts: number
  categories: number
  tags: number
  archivePages: number
  stack: StackItem[]
  generatedAt: string
  fetchedAt?: string
}

/**
 * 兜底值：2026-11 手工核对过的真实数字。
 *
 * 抓取和缓存都失效时用它，页面不会出现空值、0 或者 NaN。
 * 平时它只在 fetch-stats.mjs 里作为最后一道保险被写进 json。
 */
export const FALLBACK: BlogStats = {
  posts: 137,
  categories: 23,
  tags: 172,
  archivePages: 12,
  stack: [
    { name: 'Java', count: 75 },
    { name: '数据库', count: 26 },
    { name: 'Redis', count: 24 },
    { name: '设计模式', count: 24 },
    { name: 'Spring Boot', count: 21 },
    { name: 'Linux', count: 15 },
    { name: '性能优化', count: 14 },
    { name: '并发编程', count: 14 },
    { name: 'Docker', count: 13 },
    { name: '系统管理', count: 13 },
  ],
  generatedAt: '2026-11-01T00:00:00.000Z',
}

const data = raw as Partial<BlogStats>

/**
 * 只接受大于 0 的整数，坏数据一律退回兜底。
 *
 * 为什么不是 >= 0：这个站常年有上百篇笔记，任何一个统计值变成 0
 * 都说明数据不完整（而不是「真的没有」）。渲染成「0 个标签」比
 * 显示上一次的正确值更糟，所以 0 一律当作无效。
 */
function numberOr(key: 'posts' | 'categories' | 'tags' | 'archivePages'): number {
  const value = data[key]
  return typeof value === 'number' && Number.isFinite(value) && value > 0
    ? Math.round(value)
    : FALLBACK[key]
}

/** 标签列表要非空且每项字段齐全，否则退回兜底 */
export const stack: StackItem[] = (() => {
  const list = data.stack
  if (!Array.isArray(list) || list.length === 0) return FALLBACK.stack
  const clean = list.filter(
    (item): item is StackItem =>
      !!item &&
      typeof item.name === 'string' &&
      item.name.length > 0 &&
      typeof item.count === 'number' &&
      Number.isFinite(item.count) &&
      item.count > 0,
  )
  return clean.length > 0 ? clean.map((item) => ({ name: item.name, count: item.count })) : FALLBACK.stack
})()

export const stats: Stat[] = [
  { label: '笔记', value: numberOr('posts'), unit: '篇' },
  { label: '分类', value: numberOr('categories'), unit: '个' },
  { label: '标签', value: numberOr('tags'), unit: '个' },
  // 公开项目挂在 GitHub，博客统计拿不到，仍然手工维护
  { label: '公开项目', value: 8, unit: '个' },
  { label: '归档', value: numberOr('archivePages'), unit: '页' },
]

/** 档案面板右上角的时间戳，直接用博客最后一次生成的时间 */
export const statsStamp = (() => {
  const rawDate = data.generatedAt
  if (typeof rawDate !== 'string') return '2026-11'
  const date = new Date(rawDate)
  if (Number.isNaN(date.getTime())) return '2026-11'
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
})()

/** 首页文案里引用的笔记篇数 */
export const noteCount = numberOr('posts')

/** 归档页数，links.ts 的文案要用 */
export const archivePages = numberOr('archivePages')

/** 标签总数，links.ts 的文案要用 */
export const tagCount = numberOr('tags')

/** 条形图以出现最多的那项为满格 */
export const stackMax = stack.reduce((max, item) => Math.max(max, item.count), 0)

/** 换算成条形图宽度，如 26 → "35.1%" */
export function barWidth(count: number): string {
  if (count >= stackMax) return '100%'
  return `${((count / stackMax) * 100).toFixed(1)}%`
}
