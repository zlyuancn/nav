<script setup lang="ts">
import type { SkipType } from '@/client/loadConfig';
import { useConfig } from '@/stores/config';
import { useSelectTag } from '@/stores/selectTag';

const config = useConfig();
const selectTag = useSelectTag();

// 获取跳转连接
function getHref(skips: Array<SkipType>): SkipType | null {
    for (let i in skips) {
        let skip = skips[i]
        if (skip.tagKey == selectTag.tag?.tagKey) {
            return skip
        }
    }
    return null
}
</script>

<template>
    <div links>
        <ul>
            <li v-for="link in config.links">
                <a :href="getHref(link?.skips)?.skipUri" :target="getHref(link?.skips)?.skipType">
                    <div class="link-title"><strong>{{ link.title }}</strong></div>
                </a>
            </li>
        </ul>
    </div>
</template>

<style>
div[links] {
    position: fixed;
    bottom: 20px;
    right: 20px;

    width: 150px;
    z-index: 1;
    text-align: right;
}
</style>