import type { TagsConfig } from '@/client/loadConfig'
export const useSelectTag = defineStore('selectTag', {
    state: () => ({
        tag: {} as TagsConfig[number], // 选择的 tag
    })
})
