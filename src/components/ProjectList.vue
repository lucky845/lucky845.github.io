<script setup lang="ts">
import { projects } from '../data/projects'
</script>

<template>
  <section id="work" class="sec wrap fx" aria-labelledby="work-title">
    <div class="sec-head">
      <p class="sec-idx mono">图 02</p>
      <h2 id="work-title" class="sec-title">在造的东西</h2>
      <span class="sec-rule" aria-hidden="true"></span>
      <p class="sec-meta mono">清单 · {{ projects.length }} 件</p>
    </div>
    <p class="sec-note">自己每天在用的，或者拿来把某个问题想透的。全部开源在 GitHub。</p>
    <ul class="projects">
      <li v-for="(project, index) in projects" :key="project.name" class="project">
        <span class="p-idx mono">{{ String(index + 1).padStart(2, '0') }}</span>
        <div class="p-main">
          <a class="p-title" :href="project.href" rel="noopener">{{ project.name }}</a>
          <p class="p-desc">{{ project.description }}</p>
        </div>
        <p class="p-meta">
          <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          <span v-if="project.live" class="live">可在线试用</span>
        </p>
      </li>
    </ul>
  </section>
</template>
