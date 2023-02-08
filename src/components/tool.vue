<script setup lang="ts">
import type { SkipType, Tool } from '@/client/loadConfig'
import { useSelectTag } from '@/stores/selectTag'

const selectTag = useSelectTag();

const props = defineProps<{
    tool: Tool
    size: string,
    getHref: (skips: Array<SkipType>) => SkipType | null
}>()

</script>

<template>
    <div v-if="!selectTag.tag.filterInvalid || getHref(tool?.skips) != null" :forbidden="getHref(tool?.skips) == null">
        <el-tooltip effect="light" :disabled="!tool.desc" :content="tool.desc">
            <div Tool :size="size">
                <a :href="getHref(tool?.skips)?.skipUri" :target="getHref(tool?.skips)?.skipType || '_self'">
                    <el-image :src="tool.icon || '/icons/tool.ico'" fit="contain" />
                    <div class="tool-title"><strong>{{ tool.title }}</strong></div>
                </a>
            </div>
        </el-tooltip>
    </div>
</template>

<style>
div[Tool] {
    --large: 128px;
    --default: 72px;
    --small: 36px;
}

div[Tool] a {
    width: 100px;
}

div[Tool][size='large'] {
    overflow: hidden;
    width: var(--large);
}

div[Tool][size="default"] {
    width: var(--default);
}

div[Tool][size="small"] {
    width: var(--large);
    height: var(--small);
    vertical-align: middle
}

div[size='large'] div.el-image img {
    width: var(--large);
    height: var(--large)
}

div[size='default'] div.el-image img {
    width: var(--default);
    height: var(--default)
}

div[size='small'] div.el-image img {
    width: var(--small);
    height: var(--small)
}

div[size='small'] div.tool-title {
    position: absolute;
    display: inline;
    width: 96px;
    height: var(--small);
    text-align: left;
}

/* tool文字高光 */
div.tool-title {
    word-wrap: break-word;
    text-align: center;
    height: 32px;
    line-height: 32px;
    display: block;
    font-size: 14px;
    color: #2f2f2f;
    text-shadow: 0 0 12px #f1f1f1;
    overflow: hidden;
    text-overflow: ellipsis;
}

html.dark .tool-title {
    color: #f1f1f1;
    text-shadow: 0 0 12px #2f2f2f;
}

/* a去掉下划线 */
a:-webkit-any-link {
    text-decoration: none;
}

/* 禁用时的光标 */
div[forbidden='true'] {
    cursor: not-allowed;
}

/* 禁用时图片特效 */
div[forbidden='true'] img {
    transform: translateY(-128px);
    filter: drop-shadow(#CDD0D6af 0 128px);
}

/* 动画 */
div[forbidden='false'] img:hover {
    animation-name: shake;
    animation-duration: 1s;
}

/* 动画定义 */
@keyframes shake {
    20% {
        -webkit-transform: rotate(15deg);
        -ms-transform: rotate(15deg);
        transform: rotate(15deg)
    }

    40% {
        -webkit-transform: rotate(-10deg);
        -ms-transform: rotate(-10deg);
        transform: rotate(-10deg)
    }

    60% {
        -webkit-transform: rotate(5deg);
        -ms-transform: rotate(5deg);
        transform: rotate(5deg)
    }

    80% {
        -webkit-transform: rotate(-5deg);
        -ms-transform: rotate(-5deg);
        transform: rotate(-5deg)
    }

    100% {
        -webkit-transform: rotate(0);
        -ms-transform: rotate(0);
        transform: rotate(0)
    }
}

</style>