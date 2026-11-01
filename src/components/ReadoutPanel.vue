<script setup lang="ts">
import { ref, watch } from 'vue'
import { stats, statsStamp } from '../data/site'
import { prefersReducedMotion, useInView } from '../composables/useInView'

const root = ref<HTMLElement | null>(null)
const inView = useInView(root, { threshold: 0.5, rootMargin: '0px' })

/** 进视口后把读数从 0 滚到目标值，减少动效时保持静态 */
watch(inView, (visible) => {
  if (!visible || prefersReducedMotion()) return
  const host = root.value
  if (!host) return

  const numbers = Array.from(host.querySelectorAll<HTMLElement>('[data-n]'))
  const targets = numbers.map((el) => Number(el.dataset.n) || 0)
  const start = performance.now()
  const duration = 950

  const step = (now: number): void => {
    const progress = Math.min(1, (now - start) / duration)
    const eased = 1 - Math.pow(1 - progress, 3)
    numbers.forEach((el, index) => {
      el.textContent = String(Math.round(targets[index] * eased))
    })
    if (progress < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})
</script>

<template>
  <div ref="root" class="readout">
    <div class="readout-head">
      <span>站点档案</span>
      <span>{{ statsStamp }}</span>
    </div>
    <dl class="readout-rows">
      <div v-for="stat in stats" :key="stat.label" class="readout-row">
        <dt>{{ stat.label }}</dt>
        <dd><span :data-n="stat.value">{{ stat.value }}</span><em>{{ stat.unit }}</em></dd>
      </div>
    </dl>
    <p class="readout-stamp">数字取自博客统计与 GitHub，随文章更新。</p>
  </div>
</template>
