<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { site } from '../data/site'

const scrolled = ref(false)

function onScroll(): void {
  scrolled.value = (window.scrollY || 0) > 8
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<template>
  <header class="bar" :class="{ scrolled }">
    <div class="bar-in wrap">
      <a class="bar-id" href="/">{{ site.name }}</a>
      <span class="bar-role">{{ site.role }}</span>
      <nav class="bar-nav" aria-label="主要导航">
        <a :href="site.blog">笔记</a>
        <a href="#work">项目</a>
        <a href="#stack">技术栈</a>
        <a :href="site.github" rel="noopener">GitHub</a>
      </nav>
    </div>
  </header>
</template>
