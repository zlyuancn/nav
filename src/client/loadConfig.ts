import { loadConfigData, EncodeType } from './loadData'

// 主要配置
export interface MainConfig {
    // 标题
    title: string,
    // icon
    icon: string,
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
    // 配置文件
    configFile: {
        tags: string,
        groups: string,
        links: string,
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
    // 当工具不可用时, 过滤掉该工具和组
    filterInvalid: boolean
}>

export async function loadTagsConfig(path = 'configs/tags.yaml'): Promise<TagsConfig> {
    let a: TagsConfig = Object.create({});
    await loadConfigData(path, { encodeType: EncodeType.YAML, writeTarget: a });
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
    icon: string,
    // 描述
    desc: string,
    // 跳转类型
    skips: Array<SkipType>
}
export type GroupsConfig = Array<{
    // 显示文本
    title: string;
    // 工具显示大小, 可选 large(默认), default, small
    toolSize: string;
    // 工具列表
    tools: Array<Tool>
}>

export async function loadGroupsConfig(path = 'configs/groups.yaml'): Promise<GroupsConfig> {
    let a: GroupsConfig = Object.create({});
    await loadConfigData(path, { encodeType: EncodeType.YAML, writeTarget: a });
    return a
}

export type Links = Array<{
    // 标题
    title: string;
    // 描述
    desc: string,
    // 跳转类型
    skips: Array<SkipType>
}>

export async function loadLinksConfig(path = 'configs/links.yaml'): Promise<Links> {
    let a: Links = Object.create({});
    await loadConfigData(path, { encodeType: EncodeType.YAML, writeTarget: a });
    return a
}
