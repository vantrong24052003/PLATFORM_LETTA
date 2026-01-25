<script setup lang="ts">
import MarketplaceHeader from './MarketplaceHeader.vue'
import MarketplaceSearch from './MarketplaceSearch.vue'
import MarketplaceFilters from './MarketplaceFilters.vue'
import MarketplaceList from './MarketplaceList.vue'
import MarketplaceCTA from './MarketplaceCTA.vue'
</script>

<template>
  <section class="bg-background text-foreground py-8 sm:py-12 md:py-16">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="max-w-[1280px] mx-auto">
        <MarketplaceHeader />
        <MarketplaceSearch />
        <MarketplaceFilters />
        <MarketplaceList />
        <MarketplaceCTA />
      </div>
    </div>
  </section>
</template>
