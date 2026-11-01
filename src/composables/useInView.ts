import { onBeforeUnmount, onMounted, readonly, ref, type Ref } from 'vue'

/** 读到系统是否要求减少动效（只读，避免组件各自重复判断） */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
}

/**
 * 元素首次进入视口后置为 true，之后不再翻转。
 * 没有 IntersectionObserver 的环境直接视作已进入，内容照常显示。
 */
export function useInView(
  target: Ref<HTMLElement | null>,
  options: { threshold?: number; rootMargin?: string } = {},
) {
  const inView = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    if (!('IntersectionObserver' in window)) {
      inView.value = true
      return
    }
    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          inView.value = true
          observer?.disconnect()
          observer = null
          return
        }
      },
      {
        threshold: options.threshold ?? 0.12,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      },
    )
    if (target.value) observer.observe(target.value)
  })

  onBeforeUnmount(() => {
    observer?.disconnect()
    observer = null
  })

  return readonly(inView)
}
