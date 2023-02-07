<script lang="ts" setup>
import { LoadLocalConfig } from '@/client/loadLocalConfig';
import type { GroupsConfig, SkipType } from '@/client/loadConfig'
import { useConfig } from '@/stores/config'
import Tool from './tool.vue'
import type { ElTable } from 'element-plus';
import { useSelectTag } from '@/stores/selectTag'
import SearchTool from './SearchTool.vue';

const localConfig = LoadLocalConfig()
const config = useConfig();
const selectTag = useSelectTag();
const activeNames = ref(localConfig.value?.groups?.activeNames)
const singleTableRef = ref<InstanceType<typeof ElTable>>() // 选择某个group

interface ShowGroup {
    group: GroupsConfig[number],
    index: number, // 真实数据索引
}
const showGroups = ref<ShowGroup[]>([]) // 要显示的组列表

// group 展开变更时
watch(activeNames, (newStage) => {
    localConfig.value.groups = { activeNames: newStage }
})

init()

// 数据加载完成时
function init() {
    // 展开
    if (!activeNames.value && config?.groups && Object.values(config?.groups).length > 0) {
        activeNames.value = []
        Object.values(config.groups).map((v, index) => {
            if (v?.tools == undefined || (v.tools).length == 0) {
                return
            } else {
                activeNames.value.push(index)
            }
        })
    }

    putGroups()
}

// 如果改变了tag, 过滤掉不可用的工具
selectTag.$subscribe((mutation, state) => {
    putGroups()
})

// 放入组
function putGroups() {
    showGroups.value = []
    if (!config?.groups || Object.values(config?.groups).length == 0) {
        return
    }

    if (!selectTag.tag.filterInvalid) {
        Object.values(config.groups).map((v, index) => {
            showGroups.value.push({ group: v, index })
        })
        return
    }
    Object.values(config.groups).map((v, index) => {
        if (v?.tools == undefined || (v.tools).length == 0) {
            return
        }

        for (let i in v.tools) {
            let tool = v.tools[i]
            if (getHref(tool?.skips)) {
                showGroups.value.push({ group: v, index })
                return
            }
        }
    })
}

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

const flickerGroup = ref(-1) // 用于闪烁的组
let lastClickTableTime = 0; // 最后点击table的时间(毫秒)
// 跳转到组
function skipGroup(row: ShowGroup, column: any, cell: any, event: any) {
    _skipGroup(row)
}
function _skipGroup(row: ShowGroup) {
    let index = showGroups.value.indexOf(row);
    // 展开
    if (activeNames.value.indexOf(index) == -1) {
        activeNames.value.push(index)
    }

    // 跳转, 当元素不再页面内时
    const groupElement = document.getElementById('group_' + index)
    if (groupElement) {
        let p = elementPosition(groupElement);
        let scrollTop = document.documentElement.scrollTop;
        let clientHeight = document.documentElement.clientHeight;
        if (p.y < scrollTop || p.y > (scrollTop + clientHeight) - 200) {
            window.scrollTo({
                top: p.y - 150,
                behavior: "smooth"
            });
        }
    }

    // 闪烁
    flickerGroup.value = index
    lastClickTableTime = (new Date()).getTime()
    setTimeout(() => {
        if ((new Date()).getTime() - lastClickTableTime >= 600) {
            flickerGroup.value = -1
        }
    }, 600)
}

document.onscroll = scrollGroup
function scrollGroup() {
    let scrollTop = document.documentElement.scrollTop;
    scrollTop += 100;
    let groups = document.getElementsByClassName('group-div');
    if (!groups) {
        return
    }
    for (let group of Object.values(groups).reverse()) {
        let p = elementPosition(group);
        if (scrollTop > p.y) {
            let index: any = group.getAttribute('index');
            singleTableRef.value!.setCurrentRow(showGroups.value[index])
            break
        }
    }
}

// 获取元素坐标
function elementPosition(obj: any) {
    let curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        curleft = obj.offsetLeft;
        curtop = obj.offsetTop;
        while (obj = obj.offsetParent) {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        }
    }
    return { x: curleft, y: curtop };
}
</script>

<template>
    <el-row fadeInLeft :gutter="10" justify="center">
        <div v-if="Object.values(showGroups || []).length > 0">
            <el-col :span="6" :offset="6">
                <SearchTool :showGroups="showGroups" @skipGroup="skipGroup" />
            </el-col>
            <el-col :span="6" />
        </div>
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="16">
            <el-collapse v-model="activeNames">
                <div v-for="(group, index) in showGroups" :flicker-group="flickerGroup == index" class="group-div"
                    :index="index">
                    <el-collapse-item :title="group.group.title" :name="index" :id="'group_' + index"
                        :disabled="(group.group?.tools == undefined) || Object.values(group.group.tools).length == 0">

                        <ul>
                            <li v-for="tool in group.group?.tools">
                                <Tool :tool="tool" :getHref="getHref" :size="group.group.toolSize || 'large'" />
                            </li>
                        </ul>
                    </el-collapse-item>
                </div>
            </el-collapse>
        </el-col>
    </el-row>
    <div group-table fadeInLeft>
        <el-table group highlight-current-row :data="showGroups" @cell-click="skipGroup" ref="singleTableRef">
            <el-table-column prop="group.title" label="组" width="180" />
        </el-table>
    </div>
</template>

<style>
/* 固定在左边 */
div[group-table] {
    position: fixed;
    top: 100px;
    left: 50px;
    z-index: 1;
}

/* table背景色 */
.el-table[group] {
    min-width: 100px;
    height: 600px;
    --el-table-border-color: #00000000;
    /* --el-table-header-bg-color: #ffffff5f; */
    --el-table-tr-bg-color: #ffffff2f;
    background-color: #ffffff2f;
}

/* table暗黑模式背景色 */
html.dark .el-table[group] {
    /* --el-table-header-bg-color: #0000005f; */
    --el-table-tr-bg-color: #0000004f;
    background-color: #0000004f;
}

/* 隐藏head */
.el-table[group] thead tr {
    display: none;
}

/* 将item指针设为可点击 */
.el-table[group] tbody tr {
    cursor: pointer;
}


/* group背景透明 */
.el-collapse {
    --el-collapse-header-bg-color: #00000000;
    --el-collapse-content-bg-color: #00000000;
}

/* tool矩形控制 */
div.group-div li {
    list-style-type: none;
    float: left;
    margin: 10px 10px 15px 25px;
}

/* 跳转group时闪烁 */
div[flicker-group='true'] {
    animation: flicker 0.15s infinite alternate;
    animation-iteration-count: 4;
}

@keyframes flicker {
    0% {
        transform: scale(1);
        background-color: #00000000;
    }

    100% {
        transform: scale(1.02);
        background-color: #ffffff4f;
    }
}
</style>