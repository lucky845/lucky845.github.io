<script setup lang="ts">
import { computed } from 'vue'
import type { LinkItem } from '../data/links'

const props = defineProps<{
  /** 同时用作锚点 id 与标题 id 前缀 */
  sectionId: string
  /** 图纸图号，如「图 03」，同时推导条目编号 3.1 / 3.2 … */
  fig: string
  title: string
  note?: string
  links: LinkItem[]
}>()

/** 「图 03」→ 3，用于条目编号 3.1 / 3.2 … */
const figNum = computed(() => {
  const m = props.fig.match(/\d+/)
  return m ? String(parseInt(m[0], 10)) : ''
})
</script>

<template>
  <section :id="sectionId" class="sec-plain fx" :aria-labelledby="`${sectionId}-title`">
    <div class="sec-head">
      <p class="sec-idx mono">{{ fig }}</p>
      <h2 :id="`${sectionId}-title`" class="sec-title">{{ title }}</h2>
      <span class="sec-rule" aria-hidden="true"></span>
    </div>
    <p v-if="note" class="sec-note">{{ note }}</p>
    <ul class="links">
      <li v-for="(link, index) in links" :key="link.label">
        <span class="l-idx mono">{{ figNum }}.{{ index + 1 }}</span>
        <a :href="link.href" :rel="link.external ? 'noopener' : undefined">{{ link.label }}</a>
        <span class="note">{{ link.note }}</span>
      </li>
    </ul>
  </section>
</template>
