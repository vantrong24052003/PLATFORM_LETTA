<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import * as Icon from '@/components/ui/icon'
import noImageAvailable from '@/assets/images/no-image-available.jpg'

const { t } = useI18n()
const SCOPE = 'marketplace'
const NO_IMAGE_AVAILABLE = noImageAvailable

const items = ref([
  {
    id: 1,
    category: t(`${SCOPE}.items.0.category`),
    title: t(`${SCOPE}.items.0.title`),
    author: t(`${SCOPE}.items.0.author`),
    rating: 4.9,
    reviews: 120,
    price: '25.000đ',
    badge: t(`${SCOPE}.items.0.badge`),
    image: NO_IMAGE_AVAILABLE,
  },
  {
    id: 2,
    category: t(`${SCOPE}.items.1.category`),
    title: t(`${SCOPE}.items.1.title`),
    author: t(`${SCOPE}.items.1.author`),
    rating: 4.8,
    reviews: 88,
    price: t(`${SCOPE}.items.1.price`),
    badge: null,
    image: NO_IMAGE_AVAILABLE,
  },
  {
    id: 3,
    category: t(`${SCOPE}.items.2.category`),
    title: t(`${SCOPE}.items.2.title`),
    author: t(`${SCOPE}.items.2.author`),
    rating: 5.0,
    reviews: 45,
    price: '15.000đ',
    badge: null,
    image: NO_IMAGE_AVAILABLE,
  },
  {
    id: 4,
    category: t(`${SCOPE}.items.3.category`),
    title: t(`${SCOPE}.items.3.title`),
    author: t(`${SCOPE}.items.3.author`),
    rating: 4.7,
    reviews: 92,
    price: '30.000đ',
    badge: null,
    image: NO_IMAGE_AVAILABLE,
  },
])

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src !== NO_IMAGE_AVAILABLE) {
    img.src = NO_IMAGE_AVAILABLE
  }
}
</script>

<template>
  <div>
    <h2 class="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">
      {{ t(`${SCOPE}.list.title`) }}
    </h2>
    <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
      <Card
        v-for="item in items"
        :key="item.id"
        class="bg-card border-border hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div class="relative">
          <div class="w-full h-[204px] bg-muted relative overflow-hidden">
            <img
              :src="item.image"
              :alt="item.title"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
          </div>
          <div
            v-if="item.badge"
            class="absolute top-2 right-2 bg-chart-4/90 rounded-full px-2 py-1"
          >
            <span class="text-xs font-bold text-foreground">{{ item.badge }}</span>
          </div>
        </div>
        <CardHeader class="p-4">
          <p class="text-xs font-semibold text-primary mb-2 leading-[1.33em]">
            {{ item.category }}
          </p>
          <CardTitle class="text-base font-bold text-foreground mb-3 line-clamp-2 leading-[1.375em]">
            {{ item.title }}
          </CardTitle>
          <div class="flex items-center gap-2 mb-2">
            <div class="w-5 h-5 rounded-full bg-muted flex-shrink-0"></div>
            <p class="text-xs text-muted-foreground leading-[1.33em]">{{ item.author }}</p>
          </div>
          <div class="flex items-center gap-2 mb-3">
            <Icon.Star class="w-4 h-5 text-chart-4" fill="currentColor" />
            <span class="text-sm font-bold text-muted-foreground leading-[1.43em]">
              {{ item.rating }} ({{ item.reviews }})
            </span>
          </div>
          <p class="text-base font-bold text-primary leading-[1.5em]">
            {{ item.price }}
          </p>
        </CardHeader>
      </Card>
    </div>
    <div class="flex items-center justify-center gap-2 mt-8">
      <Button variant="ghost" size="icon" class="opacity-50 rounded-lg w-9 h-9">
        <Icon.ChevronLeft class="w-4 h-4" />
      </Button>
      <Button class="bg-primary text-primary-foreground rounded-lg w-9 h-9">1</Button>
      <Button variant="ghost" class="rounded-lg w-9 h-9">2</Button>
      <Button variant="ghost" class="rounded-lg w-9 h-9">3</Button>
      <span class="text-muted-foreground">...</span>
      <Button variant="ghost" class="rounded-lg w-9 h-9">10</Button>
      <Button variant="ghost" size="icon" class="rounded-lg w-9 h-9">
        <Icon.ChevronRight class="w-4 h-4" />
      </Button>
    </div>
  </div>
</template>
