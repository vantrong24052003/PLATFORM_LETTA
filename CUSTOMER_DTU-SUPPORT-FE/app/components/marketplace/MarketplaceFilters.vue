<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Button } from '@/components/ui/button'
import * as Icon from '@/components/ui/icon'

const { t } = useI18n()
const SCOPE = 'marketplace'

const filters = [
  { key: 'subject', label: t(`${SCOPE}.filters.subject`) },
  { key: 'type', label: t(`${SCOPE}.filters.type`) },
  { key: 'format', label: t(`${SCOPE}.filters.format`) },
  { key: 'sort', label: t(`${SCOPE}.filters.sort`) },
]
</script>

<template>
  <div class="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
    <Button
      v-for="filter in filters"
      :key="filter.key"
      variant="outline"
      class="bg-muted border-border hover:bg-muted/80 h-9 rounded-lg"
    >
      {{ filter.label }}
      <Icon.ChevronDown class="w-4 h-4 ml-2" />
    </Button>
  </div>
</template>
