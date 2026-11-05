<script setup lang="ts">
import { ref } from 'vue'
import { barWidth, noteCount, stack, stackMax, tagCount } from '../data/site'
import { useInView } from '../composables/useInView'

const list = ref<HTMLElement | null>(null)
/** 进视口才开始生长；延迟链在模板里按序号排 */
const inView = useInView(list, { threshold: 0.3, rootMargin: '0px' })

/**
 * 刻度尺行：0 / 25 / 50 / 75 四档，位置按轴长换算。
 * 轴长 = 最高项 + 5 的余量（当前 75 + 5 = 80，与原型 0%/31.25%/62.5%/93.75% 一致）；
 * 刻度值是真实篇数，数据漂移时位置跟着轴长走。
 */
const axisMax = stackMax + 5
const scaleTicks = [0, 25, 50, 75].map((value) => ({
  label: String(value),
  left: `${((value / axisMax) * 100).toFixed(2)}%`,
}))
</script>

<template>
  <section id="stack" class="sec wrap fx" aria-labelledby="stack-title">
    <div class="sec-head">
      <p class="sec-idx mono">图 01</p>
      <h2 id="stack-title" class="sec-title">笔记里的技术栈</h2>
      <span class="sec-rule" aria-hidden="true"></span>
      <p class="sec-meta mono">信号 · TOP 10 / {{ tagCount }}</p>
    </div>
    <p class="sec-note">
      按 {{ noteCount }} 篇笔记的标签计数，一条笔记打多个标签就算多次。前十个如下。
    </p>
    <div class="meter">
      <div class="m-scale mono" aria-hidden="true">
        <span class="m-scale-label">篇数</span>
        <div class="m-scale-track">
          <i v-for="tick in scaleTicks" :key="tick.label" :style="{ left: tick.left }">{{ tick.label }}</i>
        </div>
        <span class="m-scale-end"></span>
      </div>
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
    </div>
  </section>
</template>
