<script setup lang="ts">
import { site } from '../data/site'

const blogUrl = site.blog
</script>

<template>
  <footer class="foot">
    <div class="wrap">
      <p>
        © 2025 lucky845　|　静态站点，托管在 GitHub Pages　|　笔记在 <a :href="blogUrl">blog.lucky845.top</a><br>
        这个页面没有外部依赖，不加载任何第三方字体和脚本。
      </p>
    </div>
  </footer>
</template>
