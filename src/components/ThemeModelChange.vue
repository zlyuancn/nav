<script setup lang="ts">
import { Moon, Sunny } from '@element-plus/icons-vue';
import { useDark } from '@vueuse/core'
const isDark = useDark()
</script>

<template>
    <el-switch v-model="isDark" :active-icon="Moon" :inactive-icon="Sunny" inline-prompt
        style="--el-switch-on-color: #4f4f4f; --el-switch-off-color: #b1b1b1" />
</template>