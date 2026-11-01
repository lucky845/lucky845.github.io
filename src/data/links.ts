import { archivePages, noteCount, tagCount } from './site'

export interface LinkItem {
  label: string
  href: string
  note: string
  /** 站外链接加 rel="noopener" */
  external?: boolean
}

/** 首页「写下来的东西」区块 */
export const noteLinks: LinkItem[] = [
  {
    label: '归档',
    href: 'https://blog.lucky845.top/archives/',
    note: `按时间翻全部笔记，共 ${archivePages} 页`,
  },
  {
    label: '分类',
    href: 'https://blog.lucky845.top/categories/',
    note: 'Java、Spring Boot、Linux、Redis、数据库、并发编程',
  },
  {
    label: '标签',
    href: 'https://blog.lucky845.top/tags/',
    note: `按具体技术点找，${noteCount} 篇里出现过 ${tagCount} 个标签`,
  },
  {
    label: 'RSS',
    href: 'https://blog.lucky845.top/atom.xml',
    note: '订阅新文章，用任意阅读器',
  },
]

/** 首页「在别处」区块 */
export const elsewhereLinks: LinkItem[] = [
  {
    label: 'GitHub',
    href: 'https://github.com/lucky845',
    note: '代码和全部公开项目',
    external: true,
  },
  {
    label: '邮箱',
    href: 'mailto:1447545564@qq.com',
    note: '合作、提问、纠错都可以直接发',
  },
  {
    label: '主页源码',
    href: 'https://github.com/lucky845/lucky845.github.io',
    note: 'Vite + Vue 3 + TypeScript，组件化维护',
    external: true,
  },
]
