import type { Tag } from '@/client/loadConfig'
export const useSelectTag = defineStore('selectTag', {
    state: () => ({
        tag: {} as Tag, // 选择的 tag
    })
})
