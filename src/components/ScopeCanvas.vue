<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '../composables/useInView'

/** 示波器：三条信号通道 + 四分网格 + 底部刻度 + 沿主波移动的扫描光点（B 方案构图）。
 *  减少动效的用户只画一帧静态波形，不进入循环；离屏与后台标签页自动暂停。 */
const wrapRef = ref<HTMLElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)
const reduce = prefersReducedMotion()

let ctx: CanvasRenderingContext2D | null = null
let dpr = 1
let width = 0
let height = 0
let raf = 0
let t0 = 0
let pausedAt = 0
let heroVisible = true
let pageVisible = true
let observer: IntersectionObserver | null = null

/** 三条波的参数与 proto-b/b.js 完全一致 */
const waves = [
  { a: 0.16, f: 0.006, s: 1.0, color: 'rgba(78,194,198,.34)', lineWidth: 1.4 },
  { a: 0.1, f: 0.01, s: 1.6, color: 'rgba(78,194,198,.55)', lineWidth: 1.2 },
  { a: 0.05, f: 0.017, s: 2.4, color: 'rgba(216,154,63,.5)', lineWidth: 1 },
] as const

function ybase(): number {
  return height * 0.62
}

function resize(): void {
  const wrap = wrapRef.value
  const canvas = canvasRef.value
  if (!wrap || !canvas || !ctx) return
  const rect = wrap.getBoundingClientRect()
  width = Math.max(1, Math.round(rect.width))
  height = Math.max(1, Math.round(rect.height))
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (!raf) draw(performance.now())
}

function drawGrid(): void {
  if (!ctx) return
  ctx.strokeStyle = 'rgba(31,44,51,.55)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = width * 0.25; x < width; x += width * 0.25) {
    ctx.moveTo(x, 0)
    ctx.lineTo(x, height)
  }
  for (let y = height * 0.33; y < height; y += height * 0.33) {
    ctx.moveTo(0, y)
    ctx.lineTo(width, y)
  }
  ctx.stroke()
  // 底部刻度
  ctx.strokeStyle = 'rgba(58,82,94,.8)'
  ctx.beginPath()
  for (let x = 0; x <= width; x += 64) {
    ctx.moveTo(x + 0.5, height)
    ctx.lineTo(x + 0.5, height - 6)
  }
  ctx.stroke()
}

function waveY(x: number, wave: (typeof waves)[number], t: number): number {
  const envelope = Math.sin((x / width) * Math.PI)
  return ybase() + Math.sin(x * wave.f + t * wave.s) * wave.a * height * envelope
}

function draw(now: number): void {
  if (!ctx) return
  const t = (now - t0) / 1000
  ctx.clearRect(0, 0, width, height)
  drawGrid()

  for (const wave of waves) {
    ctx.strokeStyle = wave.color
    ctx.lineWidth = wave.lineWidth
    ctx.beginPath()
    for (let px = 0; px <= width; px += 3) {
      const py = waveY(px, wave, t)
      if (px === 0) ctx.moveTo(px, py)
      else ctx.lineTo(px, py)
    }
    ctx.stroke()
  }

  // 扫描光点骑在第一条波上
  const sx = (t * 60) % width
  const sy = waveY(sx, waves[0], t)
  ctx.fillStyle = '#4EC2C6'
  ctx.beginPath()
  ctx.arc(sx, sy, 2.6, 0, Math.PI * 2)
  ctx.fill()
  ctx.strokeStyle = 'rgba(78,194,198,.25)'
  ctx.beginPath()
  ctx.moveTo(sx, 0)
  ctx.lineTo(sx, height)
  ctx.stroke()
}

function loop(now: number): void {
  draw(now)
  raf = requestAnimationFrame(loop)
}

function pause(): void {
  if (!raf) return
  cancelAnimationFrame(raf)
  raf = 0
  pausedAt = performance.now()
}

function resume(): void {
  if (raf) return
  t0 += performance.now() - pausedAt
  raf = requestAnimationFrame(loop)
}

function sync(): void {
  if (heroVisible && pageVisible) resume()
  else pause()
}

function onResize(): void {
  resize()
}

function onVisibilityChange(): void {
  pageVisible = !document.hidden
  sync()
}

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas || !canvas.getContext) return
  ctx = canvas.getContext('2d')
  if (!ctx) return

  dpr = Math.min(window.devicePixelRatio || 1, 2)
  t0 = performance.now()
  pageVisible = !document.hidden
  resize()

  window.addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibilityChange)

  if (reduce) return

  if ('IntersectionObserver' in window && wrapRef.value) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) heroVisible = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    observer.observe(wrapRef.value)
  }
  raf = requestAnimationFrame(loop)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', onResize)
  document.removeEventListener('visibilitychange', onVisibilityChange)
  observer?.disconnect()
  observer = null
  if (raf) cancelAnimationFrame(raf)
  raf = 0
})
</script>

<template>
  <div ref="wrapRef" class="hero-scope" aria-hidden="true">
    <canvas ref="canvasRef"></canvas>
  </div>
</template>
