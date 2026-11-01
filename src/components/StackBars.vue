<script setup lang="ts">
import { ref } from 'vue'
import { barWidth, noteCount, stack } from '../data/site'
import { useInView } from '../composables/useInView'

const list = ref<HTMLElement | null>(null)
/** 进视口才开始生长；延迟链在模板里按序号排 */
const inView = useInView(list, { threshold: 0.3, rootMargin: '0px' })
</script>

<template>
  <section id="stack" class="sec wrap fx" aria-labelledby="stack-title">
    <h2 id="stack-title" class="sec-title">笔记里的技术栈</h2>
    <p class="sec-note">
      按 {{ noteCount }} 篇笔记的标签计数，一条笔记打多个标签就算多次。前十个如下。
    </p>
    <ul ref="list" class="bars">
      <li
        v-for="(item, index) in stack"
        :key="item.name"
        :class="{ top: index === 0 }"
      >
        <span class="b-name">{{ item.name }}</span>
        <span class="b-track">
          <span
            class="b-fill"
            :class="{ armed: inView }"
            :style="{ '--w': barWidth(item.count), animationDelay: `${(0.05 + index * 0.05).toFixed(2)}s` }"
          ></span>
        </span>
        <span class="b-num">{{ item.count }}</span>
      </li>
    </ul>
  </section>
</template>
