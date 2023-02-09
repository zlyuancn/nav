<script setup lang="ts">
import type { GroupsConfig, SkipType, Tool } from '@/client/loadConfig';
interface ShowGroup {
  group: GroupsConfig[number],
  tools: Array<Tool>
}
const props = defineProps<{
  showGroups: ShowGroup[],
  getHref: (skips: Array<SkipType>) => SkipType | null
}>()
const emit = defineEmits(['skipGroup'])

const searchState = ref('')

interface RestaurantItem {
  value: string
  group: ShowGroup,
  tool: Tool
}

function querySearch(queryString: string, cb: any) {
  let data: RestaurantItem[] = [];
  (props.showGroups || []).map((g) => {
    (g?.tools || []).map((t) => {
      if (!queryString || t.title.indexOf(queryString) > -1) {
        data.push({
          value: t.title,
          group: g,
          tool: t,
        })
        return
      }
    })
  })
  cb(data)
}

const handleSelect = (item: RestaurantItem) => {
  emit('skipGroup', item.group, item.tool)
  searchState.value = ''
  const input = document.getElementById("search-input");
  input?.blur()
}
</script>

<template>
  <div search>
    <el-autocomplete id="search-input" v-model="searchState" :fetch-suggestions="querySearch" clearable
      class="inline-input w-50" placeholder="输入工具名" @select="handleSelect">
      <template #default="{ item }">
        <div search style="padding: 0;">
          <div style="display:inline-block;">{{ item.group?.group?.title }} &nbsp->&nbsp </div>
          <el-image :forbidden="getHref(item?.tool?.skips) == null" style="width: 16px; height: 16px;"
            :src="item.tool.icon || '/icons/tool.ico'" fit="contain" />
          <div style="display:inline-block;">&nbsp{{ item.tool.title }}</div>
        </div>
      </template>
    </el-autocomplete>
  </div>
</template>

<style>
div[search] {
  padding: 10px;
}

div[search] input {
  width: 500px;
}

/* 禁用时图片特效 */
div[search] img[forbidden='true'] {
  transform: translateY(-128px);
  filter: drop-shadow(#CDD0D6af 0 128px);
}
</style>
