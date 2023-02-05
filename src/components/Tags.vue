<script setup lang="ts">
import ThemeModelChange from "./ThemeModelChange.vue"
import { useConfig } from '@/stores/config'
import { useSelectTag } from '@/stores/selectTag'
import { LoadLocalConfig } from '@/client/loadLocalConfig'
import type { Tag } from "@/client/loadConfig";

const localConfig = LoadLocalConfig()

const radio = ref(localConfig.value?.tags?.selectTagKey) // 选择tag

const config = useConfig();
const selectTag = useSelectTag();
// 允许的tagKey
const allowTagKey = new Map();

init()

function changeTag(tag: Tag) {
    selectTag.tag = tag
    localConfig.value.tags = { selectTagKey: tag.tagKey }
}

function init() {
    // 设为之前选择的tag
    let selectTagKey = localConfig.value?.tags?.selectTagKey
    if (selectTagKey){
        for(let i in config.tags){
            let tag = config.tags[i]
            if (tag.tagKey == selectTagKey){
                selectTag.tag = tag
                break
            }
        }
    }

    if (config?.groups) {
        Object.values(config?.groups).map(group => {
            group?.tools?.map(tool => {
                tool?.skips?.map(skip => {
                    allowTagKey.set(skip.tagKey, true)
                })
            })
        })
    }

    // 如果没有选择或者选择的是无效的那么默认选择第一个有效的
    if ((!radio.value || !getAllow(localConfig.value?.tags?.selectTagKey)) &&
        config?.tags && Object.values(config?.tags).length > 0) {
        for (let i in Object.values(config.tags)) {
            let tag = config.tags[i]
            if (getAllow(tag.tagKey)) {
                radio.value = tag.tagKey
                changeTag(tag)
                break
            }
        }
    }
}

// 检查是否允许选择
function getAllow(tagKey: string): boolean {
    for (let [key, value] of allowTagKey) {
        if (value && key == tagKey) return true
    }
    return false
}
</script>

<template>
    <div tag-fixed>
        <!-- tags切换 -->
        <el-radio-group size="small" v-model="radio">
            <el-space>
                <div>
                    <el-radio-button v-for="tag in config.tags" :key="tag.tagKey" @change="changeTag(tag)"
                        :label="tag.tagKey" :disabled="!getAllow(tag.tagKey)">{{ tag.title }}</el-radio-button>
                </div>

                <!-- 主题模式切换 -->
                <ThemeModelChange type="primary" size="small" />

            </el-space>
        </el-radio-group>
    </div>
</template>

<style>
/* 固定在右上角 */
div[tag-fixed] {
    position: fixed;
    top: 40px;
    right: 30px;
    z-index: 1;
}

/* 按钮透明 */
.el-radio-button {
    --el-fill-color-blank: #00000000;
}
</style>
