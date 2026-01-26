<script setup lang="ts">
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useLocaleLogic } from '@/composables/common/useLocaleLogic'

const { localeList, isLocaleActive, handleLocaleSwitch } = useLocaleLogic()
</script>

<template>
  <div class="flex items-center">
    <DropdownMenu>
      <DropdownMenuTrigger as-child>
        <Button variant="outline" size="sm" class="gap-2 rounded-lg whitespace-nowrap">
          <span>{{
            localeList.find((localeItem) => isLocaleActive(localeItem.code))
              ?.englishName || 'ENGLISH'
          }}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        class="w-56 bg-card text-card-foreground border border-border rounded-xl shadow-2xl ring-1 ring-border backdrop-blur-sm z-[9999]"
        align="end"
      >
        <DropdownMenuLabel class="text-card-foreground">{{
          $t('common.ui.language.selectLabel')
        }}</DropdownMenuLabel>
        <div class="border-t border-border mt-1" />
        <div class="p-2 grid grid-cols-3 gap-1">
          <Button
            as="button"
            variant="ghost"
            size="sm"
            v-for="localeItem in localeList"
            :key="`dd-${localeItem.code}`"
            @click="handleLocaleSwitch(localeItem.code as 'en' | 'vi' | 'ja')"
            :class="[
              'justify-start gap-2 text-xs hover:bg-muted rounded-md transition-colors',
              isLocaleActive(localeItem.code)
                ? 'bg-muted ring-1 ring-border'
                : '',
            ]"
          >
            <div class="w-3 h-3 rounded-full border border-border bg-primary" />
            <span class="truncate">{{ localeItem.label }}</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  </div>
</template>
