<script lang="ts" setup>
import { LoadLocalConfig } from '@/client/loadLocalConfig';
import type { SkipType } from '@/client/loadConfig'
import { useConfig } from '@/stores/config'
import Tool from './tool.vue'
import type { ElTable } from 'element-plus';

const localConfig = LoadLocalConfig()
const config = useConfig();
const activeNames = ref(localConfig.value?.groups?.activeNames)
const singleTableRef = ref<InstanceType<typeof ElTable>>() // 选择某个group

const groupTable = ref<Array<{ index: number, title: string }>>([])

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
                activeNames.value.push(index.toString())
            }
        })
    }
    // groupTable
    if (config?.groups && Object.values(config?.groups).length > 0) {
        Object.values(config.groups).map((v, index) => {
            if (v?.tools == undefined || (v.tools).length == 0) {
                return
            } else {
                groupTable.value.push({ index, title: v.title })
            }
        })
    }
}

// 获取跳转连接
function getHref(skips: Array<SkipType>): SkipType | null {
    for (let i in skips) {
        let skip = skips[i]
        if (skip.tagKey == config.selectTagKey) {
            return skip
        }
    }
    return null
}

const flickerGroup = ref(-1) // 用于闪烁的组
let lastClickTableTime = 0; // 最后点击table的时间(毫秒)
// 跳转到组
function skipGroup(row: { index: number, title: string }, column: any, cell: any, event: any) {
    // 展开
    if (activeNames.value.indexOf(row.index.toString()) == -1) {
        activeNames.value.push(row.index.toString())
    }
    // 跳转
    document.getElementById('group_' + row.index)?.scrollIntoView()
    // 闪烁
    flickerGroup.value = row.index
    lastClickTableTime = (new Date()).getTime()
    setTimeout(() => {
        if ((new Date()).getTime() - lastClickTableTime >= 600) {
            flickerGroup.value = -1
        }
    }, 600)
}

onMounted(() => {
    // groupTable
    if (config?.groups && Object.values(config?.groups).length > 0) {
        singleTableRef.value!.setCurrentRow(groupTable.value[0])
    }
})

document.onscroll = scrollGroup
function scrollGroup() {
    var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
    scrollTop += 100;
    var groups = document.getElementsByClassName('group-div');
    if (!groups) {
        return
    }
    for (let group of Object.values(groups).reverse()) {
        let p = elementPosition(group);
        if (scrollTop > p.y) {
            let index: any = group.getAttribute('index');
            for (let i in groupTable.value) {
                if (groupTable.value[i].index == index) {
                    singleTableRef.value!.setCurrentRow(groupTable.value[i])
                    break
                }
            }
            break;
        }
    }
}

function elementPosition(obj: any) {
    var curleft = 0, curtop = 0;
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
    <el-row :gutter="10" justify="center">
        <el-col :xs="24" :sm="24" :md="24" :lg="18" :xl="16">
            <el-collapse v-model="activeNames">
                <div v-for="(group, index) in config?.groups" :flicker-group="flickerGroup == index" class="group-div"
                    :title="group.title" :index="index">
                    <el-collapse-item :title="group.title" :name="index" :id="'group_' + index"
                        :disabled="(group?.tools == undefined) || Object.values(group.tools).length == 0">

                        <ul>
                            <li v-for="tool in group?.tools">
                                <Tool :tool="tool" />
                            </li>
                        </ul>
                    </el-collapse-item>
                </div>
            </el-collapse>
        </el-col>
    </el-row>
    <div group-fixed>
        <el-table group highlight-current-row :data="groupTable" @cell-click="skipGroup" ref="singleTableRef">
            <el-table-column prop="title" label="组" width="180" />
        </el-table>
    </div>
</template>

<style>
/* 固定在左边 */
div[group-fixed] {
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
ul li {
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