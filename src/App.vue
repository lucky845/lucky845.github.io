<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue'
import TopBar from './components/TopBar.vue'
import HeroSection from './components/HeroSection.vue'
import StackBars from './components/StackBars.vue'
import ProjectList from './components/ProjectList.vue'
import LinkSection from './components/LinkSection.vue'
import SiteFooter from './components/SiteFooter.vue'
import { elsewhereLinks, noteLinks } from './data/links'

let revealObserver: IntersectionObserver | null = null
let fallbackTimer: number | undefined

onMounted(() => {
  if (!document.documentElement.classList.contains('js-anim')) return

  const sections = Array.from(document.querySelectorAll<HTMLElement>('.fx'))
  if ('IntersectionObserver' in window) {
    revealObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add('in')
          revealObserver?.unobserve(entry.target)
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    )
    sections.forEach((section) => revealObserver?.observe(section))
  }

  /* 兜底：IO 失灵或爬虫渲染时，3 秒后全部显示，不让内容困在透明里 */
  fallbackTimer = window.setTimeout(() => {
    document.querySelectorAll('.fx:not(.in)').forEach((el) => el.classList.add('in'))
    revealObserver?.disconnect()
    revealObserver = null
  }, 3000)
})

onBeforeUnmount(() => {
  revealObserver?.disconnect()
  revealObserver = null
  if (fallbackTimer) window.clearTimeout(fallbackTimer)
})
</script>

<template>
  <a class="skip" href="#main">跳到主要内容</a>
  <div class="ruler" aria-hidden="true"></div>

  <TopBar />

  <main id="main">
    <HeroSection />
    <StackBars />
    <ProjectList />
    <div class="linkband wrap">
      <LinkSection
        section-id="notes"
        fig="图 03"
        title="写下来的东西"
        note="源码解析和线上故障追查占大头，长文居多。想按技术点找，走标签更快。"
        :links="noteLinks"
      />
      <LinkSection section-id="elsewhere" fig="图 04" title="在别处" :links="elsewhereLinks" />
    </div>
  </main>

  <SiteFooter />
</template>
