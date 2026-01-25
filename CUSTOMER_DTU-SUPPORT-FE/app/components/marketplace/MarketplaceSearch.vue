<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Input } from '@/components/ui/input'
import * as Icon from '@/components/ui/icon'

const { t } = useI18n()
const SCOPE = 'marketplace'
const searchQuery = ref('')
</script>

<template>
  <div class="flex gap-2 mb-4 sm:mb-6">
    <div class="flex-1 flex items-center bg-card border border-border rounded-xl overflow-hidden h-14">
      <div class="px-4 py-3 bg-card border-r border-border flex-shrink-0">
        <Icon.Search class="w-5 h-5 text-muted-foreground" />
      </div>
      <Input
        v-model="searchQuery"
        :placeholder="t(`${SCOPE}.search.placeholder`)"
        class="border-0 focus-visible:ring-0 flex-1 h-full"
      />
    </div>
  </div>
</template>
