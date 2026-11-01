<script setup lang="ts">
import { projects } from '../data/projects'
</script>

<template>
  <section id="work" class="sec wrap fx" aria-labelledby="work-title">
    <h2 id="work-title" class="sec-title">在造的东西</h2>
    <p class="sec-note">自己每天在用的，或者拿来把某个问题想透的。全部开源在 GitHub。</p>
    <ul class="projects">
      <li v-for="project in projects" :key="project.name" class="project">
        <a class="p-title" :href="project.href" rel="noopener">{{ project.name }}</a>
        <p class="p-desc">{{ project.description }}</p>
        <p class="p-meta">
          <span v-for="tag in project.tags" :key="tag">{{ tag }}</span>
          <span v-if="project.live" class="live">可在线试用</span>
        </p>
      </li>
    </ul>
  </section>
</template>
