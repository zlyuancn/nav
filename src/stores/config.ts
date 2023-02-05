import type { MainConfig, TagsConfig, GroupsConfig } from '@/client/loadConfig'
export const useConfig = defineStore('config', {
    state: () => ({
        main: {} as MainConfig,
        tags: [] as TagsConfig,
        groups: [] as GroupsConfig,
    }),
})
