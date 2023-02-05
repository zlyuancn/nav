<script setup lang="ts">
import { useConfig } from '@/stores/config'

const config = useConfig();
</script>

<template>
    <div style="display:flex; justify-content: center; margin-top: 100px;">
        <div v-if="config?.main?.logo?.icon">
            <a :href="config.main.logo.skip.skipUri" :target="config.main.logo.skip.skipType">
                <el-image :style="'width: ' + config.main.logo.width + '; height: ' + config.main.logo.height"
                    :src="config.main.logo.icon" :fit="config.main.logo.fit"/>
            </a>
        </div>
    </div>
</template>