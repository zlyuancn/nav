import type { MainConfig, TagsConfig, GroupsConfig, Tag } from '@/client/loadConfig'
export const useConfig = defineStore('config', {
    state: () => ({
        main: {} as MainConfig,
        tags: [] as TagsConfig,
        groups: [] as GroupsConfig,
    }),
})
