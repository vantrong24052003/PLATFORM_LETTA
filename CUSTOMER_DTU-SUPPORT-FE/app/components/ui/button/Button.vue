<script setup lang="ts">
import type { PrimitiveProps } from 'reka-ui'
import type { HTMLAttributes } from 'vue'
import type { ButtonVariants } from '.'
import { Primitive } from 'reka-ui'
import { cn } from '@/lib/utils'
import { buttonVariants } from '.'
import { Loader2 } from 'lucide-vue-next'

interface Props extends PrimitiveProps {
  variant?: ButtonVariants['variant']
  size?: ButtonVariants['size']
  class?: HTMLAttributes['class']
  loading?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  as: 'button',
  loading: false,
})
</script>

<template>
  <Primitive
    data-slot="button"
    :as="as"
    :as-child="asChild"
    :disabled="loading || props.disabled"
    :class="cn(buttonVariants({ variant, size }), props.class, loading && 'relative')"
  >
    <span v-if="loading" class="absolute inset-0 flex items-center justify-center">
      <Loader2 class="w-4 h-4 animate-spin" />
    </span>
    <span v-if="loading" class="invisible">
      <slot />
    </span>
    <template v-else>
      <slot />
    </template>
  </Primitive>
</template>
