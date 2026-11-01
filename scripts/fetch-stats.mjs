/**
 * 构建前把博客的统计数字取回来，写进 src/data/blog-stats.json。
 *
 * 为什么要绕这一圈：博客（Hexo，私有仓库）和主页（Vite，公开仓库）
 * 是两个独立仓库，主页既不该去读博客源码，浏览器端也不该在运行时
 * 跨域抓接口 —— 那会把首屏拖慢。压成一个静态 stats.json 之后，
 * 网络请求只发生在构建机上，用户端零成本。
 *
 * 三层保底，任何一层出问题都不会让部署失败：
 *   1. 抓 https://blog.lucky845.top/stats.json（博客构建时产出）
 *   2. 抓不到就沿用 src/data/blog-stats.json 里上一次成功的数据
 *   3. 连文件都没有才写 FALLBACK 常量
 *
 * 只有「抓到的数据能通过校验」才会覆盖本地缓存，
 * 避免博客临时挂掉时把主页数字刷成空值。
 */
import { writeFile, readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))
const target = resolve(here, '../src/data/blog-stats.json')

const SOURCE = process.env.STATS_URL || 'https://blog.lucky845.top/stats.json'
const TIMEOUT_MS = 10_000
const RETRIES = 2

/** 和 src/data/site.ts 里的 FALLBACK 保持一致，改一处记得改另一处 */
const FALLBACK = {
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
  source: 'fallback',
}

/** 数字必须是正整数，stack 必须是 {name, count} 数组 —— 结构不对就当没抓到 */
function validate(data) {
  if (!data || typeof data !== 'object') return '不是对象'
  for (const key of ['posts', 'categories', 'tags', 'archivePages']) {
    const value = data[key]
    // 0 视为无效：这个站常年上百篇笔记，任何一项为 0 都是数据不完整
    if (!Number.isInteger(value) || value <= 0) return `${key} 不是正整数：${String(value)}`
  }
  if (!Array.isArray(data.stack) || data.stack.length === 0) return 'stack 不是非空数组'
  const badItem = data.stack.find(
    (item) => !item || typeof item.name !== 'string' || !Number.isInteger(item.count) || item.count <= 0,
  )
  if (badItem) return 'stack 里有非法条目'
  if (typeof data.generatedAt !== 'string' || Number.isNaN(Date.parse(data.generatedAt))) {
    return `generatedAt 不是合法时间：${String(data.generatedAt)}`
  }
  // 明显不合理的值说明博客那边口径变了，宁可不用
  if (data.posts > 100_000 || data.stack.length > 50) return '数值超出合理范围'
  return null
}

async function fetchOnce() {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS)
  try {
    const response = await fetch(SOURCE, {
      signal: controller.signal,
      headers: { accept: 'application/json', 'user-agent': 'lucky845-home-build' },
    })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    return await response.json()
  } finally {
    clearTimeout(timer)
  }
}

async function readCached() {
  try {
    const data = JSON.parse(await readFile(target, 'utf8'))
    return validate(data) ? null : data
  } catch {
    return null
  }
}

async function write(data) {
  await writeFile(target, `${JSON.stringify(data, null, 2)}\n`, 'utf8')
}

function report(tag, data) {
  console.log(
    `[stats] ${tag}：${data.posts} 篇 / ${data.categories} 分类 / ${data.tags} 标签 / ${data.archivePages} 归档页`,
  )
}

async function main() {
  let lastError = ''

  for (let attempt = 1; attempt <= RETRIES + 1; attempt += 1) {
    try {
      const data = await fetchOnce()
      const problem = validate(data)
      if (problem) throw new Error(`返回结构不对：${problem}`)

      data.source = SOURCE
      data.fetchedAt = new Date().toISOString()
      await write(data)
      report('已同步', data)
      return
    } catch (error) {
      lastError = error instanceof Error ? error.message : String(error)
      if (attempt <= RETRIES) {
        const wait = attempt * 1500
        console.warn(`[stats] 第 ${attempt} 次失败（${lastError}），${wait}ms 后重试`)
        await new Promise((done) => setTimeout(done, wait))
      }
    }
  }

  const cached = await readCached()
  if (cached) {
    console.warn(`[stats] 抓取失败（${lastError}），沿用上次缓存：${cached.generatedAt}`)
    report('缓存数字', cached)
    return
  }

  await write(FALLBACK)
  console.warn(`[stats] 抓取失败（${lastError}），且没有可用缓存，已写入兜底常量`)
  console.warn('[stats] 这一轮构建继续，不会因为博客不可达而中断部署')
  report('兜底数字', FALLBACK)
}

main().catch((error) => {
  // 走到这说明是脚本自身的 bug，同样不该让部署挂掉
  console.warn('[stats] 脚本异常，跳过统计同步：', error)
})
