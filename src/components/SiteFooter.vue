<script setup lang="ts">
import { site, statsStamp } from '../data/site'

const blogUrl = site.blog
</script>

<template>
  <footer class="foot">
    <div class="wrap">
      <div class="titleblock" role="contentinfo">
        <p class="tb-decl">这个页面没有外部依赖，不加载任何第三方字体和脚本。</p>
        <div class="tb-cell"><span class="tb-k mono">作者</span><span class="tb-v">{{ site.name }}</span></div>
        <div class="tb-cell"><span class="tb-k mono">载体</span><span class="tb-v">静态站 · GitHub Pages</span></div>
        <div class="tb-cell"><span class="tb-k mono">笔记</span><span class="tb-v"><a :href="blogUrl">blog.lucky845.top</a></span></div>
        <div class="tb-cell"><span class="tb-k mono">图号</span><span class="tb-v mono">© 2025 · REV.{{ statsStamp }}</span></div>
      </div>
    </div>
  </footer>
</template>
