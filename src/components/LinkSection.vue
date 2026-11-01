<script setup lang="ts">
import type { LinkItem } from '../data/links'

defineProps<{
  /** 同时用作锚点 id 与标题 id 前缀 */
  sectionId: string
  title: string
  note?: string
  links: LinkItem[]
}>()
</script>

<template>
  <section :id="sectionId" class="sec wrap fx" :aria-labelledby="`${sectionId}-title`">
    <h2 :id="`${sectionId}-title`" class="sec-title">{{ title }}</h2>
    <p v-if="note" class="sec-note">{{ note }}</p>
    <ul class="links">
      <li v-for="link in links" :key="link.label">
        <a :href="link.href" :rel="link.external ? 'noopener' : undefined">{{ link.label }}</a>
        <span class="note">{{ link.note }}</span>
      </li>
    </ul>
  </section>
</template>
