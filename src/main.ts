import { createApp } from 'vue'
import App from './App.vue'
import './styles/global.css'

/* 首帧前定下入场动效开不开：JS 可用、浏览器支持观察器、用户没要求减少动效。
   放在 createApp 之前，避免完整内容先闪出来再被隐藏。 */
const canAnimate =
  'IntersectionObserver' in window &&
  !(window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false)

if (canAnimate) {
  document.documentElement.classList.add('js-anim')
}

createApp(App).mount('#app')
