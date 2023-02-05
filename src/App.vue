<script setup lang="ts">
import { useConfig } from './stores/config'
import { loadMainConfig, loadTagsConfig, loadGroupsConfig, type MainConfig } from './client/loadConfig'
import { LoadLocalConfig } from './client/loadLocalConfig'
import Tags from "./components/Tags.vue"
import Logo from "./components/Logo.vue"
import Groups from "./components/groups.vue"

// 配置是否加载完成
const loadOk = ref(false)

// 配置
const config = useConfig();

initConfig()

// 初始化配置
function initConfig() {
  // 本地配置
  let localConfig = LoadLocalConfig()
  if (localConfig.value.background) {
    setBackground(localConfig.value.background)
  }
  // 远程配置
  Promise.all([
    loadMainConfig(),
    loadTagsConfig(),
    loadGroupsConfig(),
  ]).then(([main, tags, groups]) => {
    config.$patch({
      main: main,
      tags: tags,
      groups: groups,
    })

    localConfig.value.background = config.main.background; // 储存背景配置
    setBackground(config.main.background) // 设置背景图
    loadOk.value = true; // 标记加载完成
  })
}

// 设置背景图
function setBackground(background: { icon: string; useMask: boolean }) {
  let bodyStyle = document.body.style;
  if (background.useMask) {
    bodyStyle.backgroundImage = 'url("/icons/mask.png"), linear-gradient(45deg, rgba(255, 165, 150, 0.5) 5%, rgba(0, 228, 255, 0.35)), url("' + background.icon + '")';
    bodyStyle.backgroundSize = '100px 100px, cover, cover'
    bodyStyle.backgroundAttachment = 'fixed, fixed, fixed'
    bodyStyle.backgroundColor = 'rgb(255,0,0,0.3)'
  } else {
    bodyStyle.background = 'url("' + background.icon + '")';
    bodyStyle.backgroundSize = '100% 100%, cover, cover'
    bodyStyle.backgroundAttachment = 'fixed, fixed, fixed'
  }
}
</script>

<template>
  <div v-loading.fullscreen.lock="!loadOk" element-loading-background="rgba(41, 41, 41, 0.5)" />
  <div class='content' v-if="loadOk">
    <Tags />
    <Logo />
    <Groups />
  </div>
</template>

<style>
div.content {
  animation-name: fadeInLeft;
  animation-duration: 1s;
}

@keyframes fadeInLeft {
  0% {
    opacity: 0;
    transform: translateX(-20px)
  }

  100% {
    opacity: 1;
    transform: translateX(0)
  }
}
</style>