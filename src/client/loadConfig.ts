import { loadConfigData, EncodeType } from './loadData'

// 主要配置
export interface MainConfig {
    // logo
    logo: {
        // 图片uri
        icon: string,
        // 图片宽度
        width: string,
        // 图片高度
        height: string,
        // 填充类型, 可选 fill, contain, cover, none, scale-down
        fit: string,
        // 跳转类型
        skip: {
            // 跳转地址
            skipUri: string,
            // 跳转类型, _self 表示在当前页面打开, _blank 表示在新的页面打开
            skipType: string,
        },
    }
    // 背景图
    background: {
        // 图片uri
        icon: string,
        // 是否使用蒙版
        useMask: boolean,
    }
}

export async function loadMainConfig(): Promise<MainConfig> {
    let a: MainConfig = Object.create({});
    await loadConfigData('configs/main.yaml', { encodeType: EncodeType.YAML, writeTarget: a });
    return a
}

// 标签
export type TagsConfig = Array<{
    // 显示文本
    title: string;
    // 一个唯一标记, 用于确认跳转时选择哪个跳转项
    tagKey: string;
}>

export async function loadTagsConfig(): Promise<TagsConfig> {
    let a: TagsConfig = Object.create({});
    await loadConfigData('configs/tags.yaml', { encodeType: EncodeType.YAML, writeTarget: a });
    return a
}


export interface SkipType {
    // 关联 TagsConfig 中定义的 tagKey
    tagKey: string,
    // 跳转地址
    skipUri: string,
    // 跳转类型, _self 表示在当前页面打开, _blank 表示在新的页面打开
    skipType: string,
}

export interface Tool {
    // 标题
    title: string,
    // 图标
    icon: string
    // 跳转类型
    skips: Array<SkipType>
}
export type GroupsConfig = Array<{
    // 显示文本
    title: string;
    // 工具列表
    tools: Array<Tool>
}>

export async function loadGroupsConfig(): Promise<GroupsConfig> {
    let a: GroupsConfig = Object.create({});
    await loadConfigData('configs/groups.yaml', { encodeType: EncodeType.YAML, writeTarget: a });
    return a
}
