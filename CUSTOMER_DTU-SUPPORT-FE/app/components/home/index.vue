<script setup lang="ts">
import Hero from './Hero.vue'
import AboutUs from './AboutUs.vue'
import WhatWeDo from './WhatWeDo.vue'
import News from './News.vue'
import ScrollIndicator from '@/components/common/ScrollIndicator.vue'
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'

const { t } = useI18n()

const homeSections = ref<{ id: string, label: string }[]>([])

onMounted(() => {
  homeSections.value = [
    { id: 'hero', label: t('common.header.menu.home') },
    { id: 'what-we-do', label: t('home.whatWeDo.title') },
    { id: 'about', label: t('home.about.title') },
    { id: 'news', label: t('home.news.title') }
  ]
})
</script>

<template>
  <div>
    <ScrollIndicator :sections="homeSections" />
    <Hero />
    <WhatWeDo />
    <AboutUs />
    <News />
  </div>
</template>
