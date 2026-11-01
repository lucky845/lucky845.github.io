<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { prefersReducedMotion } from '../composables/useInView'

/** 示波器：三条信号通道 + 刻度网格 + 沿主波移动的扫描光点。
 *  减少动效的用户只画一帧静态波形，不进入循环。 */
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

function resize(): void {
  const canvas = canvasRef.value
  if (!canvas || !ctx || !canvas.parentElement) return
  const rect = canvas.parentElement.getBoundingClientRect()
  width = Math.max(1, Math.round(rect.width))
  height = Math.max(1, Math.round(rect.height))
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  if (!raf) draw(performance.now())
}

function channel(
  y0: number,
  amp: number,
  k1: number,
  k2: number,
  p1: number,
  p2: number,
  alpha: number,
  color: string,
  t: number,
  glow: boolean,
): void {
  if (!ctx) return
  ctx.beginPath()
  for (let x = 0; x <= width + 3; x += 3) {
    const y =
      y0 +
      amp * Math.sin(x * k1 + t * 0.9 + p1) +
      amp * 0.45 * Math.sin(x * k2 - t * 0.6 + p2)
    if (x === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  if (glow) {
    ctx.globalAlpha = alpha * 0.28
    ctx.lineWidth = 5
    ctx.strokeStyle = color
    ctx.stroke()
  }
  ctx.globalAlpha = alpha
  ctx.strokeStyle = color
  ctx.lineWidth = 1.6
  ctx.stroke()
  ctx.globalAlpha = 1
}

function grid(): void {
  if (!ctx) return
  ctx.globalAlpha = 0.08
  ctx.strokeStyle = '#4EC2C6'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let x = 84; x < width; x += 84) {
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, height)
  }
  for (let y = 84; y < height; y += 84) {
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(width, y + 0.5)
  }
  ctx.stroke()
  ctx.globalAlpha = 1
}

function draw(now: number): void {
  if (!ctx) return
  const t = (now - t0) / 1000
  ctx.clearRect(0, 0, width, height)
  grid()

  const amp1 = height * 0.07
  const y1 = height * 0.68
  channel(height * 0.56, height * 0.045, 0.013, 0.031, 1.7, 0.4, 0.18, '#D89A3F', t * 0.7, false)
  channel(height * 0.76, height * 0.05, 0.009, 0.027, 4.1, 2.2, 0.24, '#4EC2C6', t * 0.55, false)
  channel(y1, amp1, 0.011, 0.023, 0, 1.3, 0.6, '#4EC2C6', t, true)

  const sx = ((t * 80) % (width + 140)) - 70
  if (sx > -60 && sx < width + 60) {
    const sy =
      y1 +
      amp1 * Math.sin(sx * 0.011 + t * 0.9) +
      amp1 * 0.45 * Math.sin(sx * 0.023 - t * 0.6 + 1.3)
    const glow = ctx.createRadialGradient(sx, sy, 0, sx, sy, 16)
    glow.addColorStop(0, 'rgba(78,194,198,.85)')
    glow.addColorStop(1, 'rgba(78,194,198,0)')
    ctx.fillStyle = glow
    ctx.beginPath()
    ctx.arc(sx, sy, 16, 0, 6.2832)
    ctx.fill()
    ctx.fillStyle = '#BFF2F3'
    ctx.beginPath()
    ctx.arc(sx, sy, 2.2, 0, 6.2832)
    ctx.fill()
  }
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
  if (reduce) draw(t0)
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

  if ('IntersectionObserver' in window && canvas.parentElement) {
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) heroVisible = entry.isIntersecting
        sync()
      },
      { threshold: 0 },
    )
    observer.observe(canvas.parentElement)
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
  <canvas ref="canvasRef" class="hero-scope" aria-hidden="true"></canvas>
</template>
