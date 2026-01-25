<script setup lang="ts">
import * as Icon from '@/components/ui/icon'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useI18n } from 'vue-i18n'
import { THEMES } from '@/constants/common/ui'
import { useThemeLogic } from '@/composables/common/useThemeLogic'

const { t } = useI18n()

const {
  currentTheme,
  isShowingLightMode,
  themeIconColor,
  handleThemeSwitch,
  getThemeDisplayLabel,
  setHtmlAttributes,
} = useThemeLogic()

setHtmlAttributes()
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline" size="sm" class="gap-1.5 sm:gap-2 rounded-lg h-8 sm:h-9 px-2 sm:px-3 whitespace-nowrap">
        <Icon.Palette
          class="h-4 w-4 sm:h-[1.2rem] sm:w-[1.2rem]"
          :style="{ color: themeIconColor }"
        />
        <span class="hidden sm:inline text-xs sm:text-sm">{{ t('common.ui.theme.label') }}</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent
      class="w-56 sm:w-64 max-w-[calc(100vw-2rem)] bg-card text-card-foreground border border-border rounded-xl shadow-2xl ring-1 ring-border backdrop-blur-sm z-[9999]"
      align="end"
    >
      <DropdownMenuLabel class="text-card-foreground text-center px-2 py-1.5">{{
        t('common.ui.theme.selectLabel')
      }}</DropdownMenuLabel>
      <div class="border-t border-border mt-1" />

      <div class="p-2 sm:p-3">
        <div class="flex items-center justify-center gap-2 px-2 pb-3">
          <Button
            size="sm"
            class="flex-1 text-xs sm:text-sm h-8 sm:h-9 max-w-[120px]"
            :variant="isShowingLightMode === 'light' ? 'default' : 'outline'"
            @click="isShowingLightMode = 'light'"
            >Light</Button
          >
          <Button
            size="sm"
            class="flex-1 text-xs sm:text-sm h-8 sm:h-9 max-w-[120px]"
            :variant="isShowingLightMode === 'dark' ? 'default' : 'outline'"
            @click="isShowingLightMode = 'dark'"
            >Dark</Button
          >
        </div>

        <div
          v-if="isShowingLightMode === 'light'"
          class="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2 justify-items-center"
        >
          <Button
            as="button"
            variant="ghost"
            size="sm"
            v-for="theme in THEMES.light"
            :key="theme.value"
            @click="handleThemeSwitch(theme.value)"
            :class="[
              'justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-muted rounded-md transition-colors h-8 sm:h-9 px-2 sm:px-3',
              currentTheme === theme.value ? 'bg-muted ring-1 ring-border' : '',
            ]"
          >
            <div
              class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-border flex-shrink-0"
              :style="{ backgroundColor: theme.color }"
            />
            <span class="truncate text-xs sm:text-sm">{{
              getThemeDisplayLabel(theme.value)
            }}</span>
          </Button>
        </div>

        <div v-else class="grid grid-cols-2 sm:grid-cols-2 gap-1.5 sm:gap-2 justify-items-center">
          <Button
            as="button"
            variant="ghost"
            size="sm"
            v-for="theme in THEMES.dark"
            :key="theme.value"
            @click="handleThemeSwitch(theme.value)"
            :class="[
              'justify-start gap-1.5 sm:gap-2 text-xs sm:text-sm hover:bg-muted rounded-md transition-colors h-8 sm:h-9 px-2 sm:px-3',
              currentTheme === theme.value ? 'bg-muted ring-1 ring-border' : '',
            ]"
          >
            <div
              class="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full border border-border flex-shrink-0"
              :style="{ backgroundColor: theme.color }"
            />
            <span class="truncate text-xs sm:text-sm">{{
              getThemeDisplayLabel(theme.value)
            }}</span>
          </Button>
        </div>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
