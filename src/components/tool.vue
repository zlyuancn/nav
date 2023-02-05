<script setup lang="ts">
import type { SkipType, Tool } from '@/client/loadConfig'
import { useSelectTag } from '@/stores/selectTag'

const selectTag = useSelectTag();

const props = defineProps<{
    tool: Tool
}>()

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
    <el-tooltip effect="light" :disabled="!props.tool.desc" :content="props.tool.desc">
        <div :cover-mask="getHref(tool?.skips) == null">
            <a :href="getHref(tool?.skips)?.skipUri" :target="getHref(tool?.skips)?.skipType">
                <el-image style="width: 128px; height: 128px;" :src="tool.icon || '/icons/tool.ico'" fit="contain" />
                <strong class="tool-title">{{ tool.title }}</strong>
            </a>
        </div>
    </el-tooltip>
</template>

<style>
/* tool文字高光 */
.tool-title {
    text-align: center;
    width: 128px;
    display: block;
    font-size: 14px;
    color: #f1f1f1;
    text-shadow: 0 0 14px #2f2f2f;
    font-family: MyriadSetPro-Thin;
    line-height: 32px;
}

html.dark .tool-title {
    color: #2f2f2f;
    text-shadow: 0 0 14px #2f2f2f;
}

/* 自定义字体 */
@font-face {
    font-family: MyriadSetPro-Thin;
    src: url(/fonts/MyriadSetPro-Thin.ttf)
}

/* a去掉下划线 */
a:-webkit-any-link {
    text-decoration: none;
}

/* 禁用时的光标 */
div[cover-mask='true'] {
    cursor: not-allowed;
}

/* 禁用时图片特效 */
div[cover-mask='true'] img {
    transform: translateY(-128px);
    filter: drop-shadow(#CDD0D6af 0 128px);
}

/* 动画 */
div[cover-mask='false'] img:hover {
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