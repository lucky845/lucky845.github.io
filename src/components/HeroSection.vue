<script setup lang="ts">
import ScopeCanvas from './ScopeCanvas.vue'
import ReadoutPanel from './ReadoutPanel.vue'
import { site } from '../data/site'

const blogUrl = site.blog
</script>

<template>
  <section class="hero" aria-labelledby="hero-title">
    <span class="reg reg-tl" aria-hidden="true"></span>
    <span class="reg reg-br" aria-hidden="true"></span>
    <div class="wrap hero-in">
      <div class="hero-status mono">
        <span><b class="ps">$</b> Java / Spring Boot / Linux / Redis</span>
        <span class="fig">FIG.01 · 后端拆解</span>
      </div>
      <div class="hero-cols">
        <div class="hero-copy">
          <h1 id="hero-title">做后端，<br>也把后端<em>拆开</em>写下来。</h1>
          <p class="lede">
            线上出的问题，我习惯追到源码和系统参数那一层再回来。
            JVM 内存模型、线程池、Redis 持久化、磁盘扩容这些追查过程，
            都写成了能直接复用的笔记。
          </p>
          <div class="cta">
            <a class="btn" :href="blogUrl" rel="noopener">读笔记</a>
            <a class="btn ghost" href="#work">看项目</a>
          </div>
        </div>
        <ReadoutPanel />
      </div>
    </div>
    <ScopeCanvas />
  </section>
</template>
