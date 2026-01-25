export const THEMES = {
  light: [
    { value: 'red-light', color: '#C8102E' },
    { value: 'blue-light', color: '#3B82F6' },
    { value: 'green-light', color: '#10B981' },
    { value: 'purple-light', color: '#8B5CF6' },
    { value: 'orange-light', color: '#F97316' },
    { value: 'pink-light', color: '#EC4899' },
  ],
  dark: [
    { value: 'red-dark', color: '#EF4444' },
    { value: 'blue-dark', color: '#60A5FA' },
    { value: 'green-dark', color: '#34D399' },
    { value: 'purple-dark', color: '#A78BFA' },
    { value: 'orange-dark', color: '#FB923C' },
    { value: 'pink-dark', color: '#F472B6' },
  ],
} as const

export const LOCALES = [
  { code: 'vi', name: 'VI', englishName: 'VIETNAMESE' },
  { code: 'en', name: 'EN', englishName: 'ENGLISH' },
  { code: 'ja', name: 'JA', englishName: 'JAPANESE' },
] as const
