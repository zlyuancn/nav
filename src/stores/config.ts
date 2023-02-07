import type { MainConfig, TagsConfig, GroupsConfig, Links } from '@/client/loadConfig'
export const useConfig = defineStore('config', {
    state: () => ({
        main: {} as MainConfig,
        tags: [] as TagsConfig,
        groups: [] as GroupsConfig,
        links: [] as Links,
    }),
})
