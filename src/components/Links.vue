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
                <div v-if="!selectTag.tag.filterInvalid || getHref(link?.skips) != null">
                    <a :title="link.desc" :href="getHref(link?.skips)?.skipUri" :target="getHref(link?.skips)?.skipType || '_blank'">
                        <div class="link-title"><strong>{{ link.title }}</strong></div>
                    </a>
                </div>
            </li>
        </ul>
    </div>
</template>

<style>
div[links] {
    position: fixed;
    bottom: 20px;
    right: 20px;

    z-index: 1;
}

div[links] li {
    list-style-type: none;
}

div.link-title {
    word-wrap: break-word;
    text-align: right;
    height: 32px;
    line-height: 32px;
    display: block;
    font-size: 13px;
    color: #2f2f2f;
    text-shadow: 0 0 12px #f1f1f1;
    padding: 3px;
    overflow: hidden;
    text-overflow: ellipsis;
}

html.dark div.link-title {
    color: #f1f1f1;
    text-shadow: 0 0 12px #2f2f2f;
}

div[links] a:not([href]) {
    cursor: not-allowed;
}
</style>