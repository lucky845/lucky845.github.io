/** 一条笔记可以打多个标签，所以这里的计数会超过笔记总数 */
export interface StackItem {
  name: string
  count: number
}

export const stack: StackItem[] = [
  { name: 'Java', count: 74 },
  { name: '数据库', count: 26 },
  { name: 'Redis', count: 24 },
  { name: '设计模式', count: 24 },
  { name: 'Spring Boot', count: 20 },
  { name: 'Linux', count: 14 },
  { name: '系统管理', count: 13 },
  { name: '性能优化', count: 13 },
  { name: '并发编程', count: 13 },
  { name: 'Docker', count: 12 },
]

/** 条形图以出现最多的那项为满格 */
export const stackMax = stack.reduce((max, item) => Math.max(max, item.count), 0)

/** 换算成条形图宽度，如 26 → "35.1%" */
export function barWidth(count: number): string {
  if (count >= stackMax) return '100%'
  return `${((count / stackMax) * 100).toFixed(1)}%`
}
