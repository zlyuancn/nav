import { useLocalStorage } from "@vueuse/core"
import type { Ref } from "vue"

export interface LocalConfig {
    // 背景图
    background: any,
    // 标签
    tags: {
        // 选择的标签key
        selectTagKey: string,
    },
    // 组
    groups: {
        // 展开的组名称
        activeNames: any,
    }
}

export function LoadLocalConfig(): Ref<LocalConfig> {
    let v = useLocalStorage("localConfig", {})
    return v as Ref<LocalConfig>
}
