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
    <div :forbidden="getHref(tool?.skips) == null">
        <div Tool :size="size">
            <a :href="getHref(tool?.skips)?.skipUri" :target="getHref(tool?.skips)?.skipType || '_self'">

                <el-tooltip effect="light" :disabled="!tool.desc" :content="tool.desc">
                    <el-image :src="tool.icon || '/icons/tool.ico'" fit="contain" />
                </el-tooltip>
                <el-tooltip effect="light" :content="tool.title">
                    <div class="tool-title"><strong>{{ tool.title }}</strong></div>
                </el-tooltip>
            </a>
        </div>
    </div>
</template>

<style>
div[Tool] {
    --big: 128px;
    --large: 96px;
    --default: 72px;
    --small: 36px;
}

div[Tool] a {
    width: 100px;
}

div[Tool][size='big'] {
    overflow: hidden;
    width: var(--big);
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

div[size='big'] div.el-image img {
    width: var(--big);
    height: var(--big)
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
    position: relative;
    top: -40px;
    left: var(--small);
    width: 128px;
    height: 30px;
    text-align: left;
    overflow: hidden;
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