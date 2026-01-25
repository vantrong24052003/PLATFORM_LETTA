<script setup lang="ts">
import { Field, ErrorMessage } from 'vee-validate'

interface Props {
  name: string
  label: string
  type?: string
  step?: string
  placeholder?: string
  required?: boolean
  errorPosition?: 'bottom' | 'right'
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  step: undefined,
  placeholder: '',
  required: false,
  errorPosition: 'bottom',
})
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center justify-between gap-3">
      <label class="text-sm font-medium text-foreground flex items-center gap-1 flex-shrink-0">
        <span>{{ label }}</span>
        <span v-if="required" class="text-red-500">*</span>
      </label>
      <div v-if="errorPosition === 'right'" class="flex-shrink-0 min-w-0 flex-1 flex justify-end">
        <ErrorMessage :name="props.name" class="block text-xs text-red-500 font-medium leading-normal text-right" />
      </div>
    </div>
    <div class="relative">
      <Field
        :name="props.name"
        :type="props.type"
        :step="props.step"
        :placeholder="props.placeholder"
        class="h-11 w-full rounded-lg border-2 border-border/40 bg-gradient-to-br from-background to-muted/20 px-4 text-sm text-foreground transition-all duration-300 placeholder:text-muted-foreground/60 focus:border-primary/60 focus:ring-2 focus:ring-primary/20 focus:ring-offset-1 focus:outline-none hover:border-primary/40 hover:bg-gradient-to-br hover:from-background hover:to-muted/30 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md focus:shadow-lg"
      />
      <ErrorMessage
        v-if="errorPosition === 'bottom'"
        :name="props.name"
        class="mt-1.5 block text-xs text-red-500 font-medium leading-normal"
      />
    </div>
  </div>
</template>
