import type { TagsConfig } from '@/client/loadConfig'
export const useSelectTag = defineStore('selectTag', {
    state: () => ({
        tag: {} as TagsConfig[number], // éĉİç tag
    })
})
