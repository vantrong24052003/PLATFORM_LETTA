import { cn } from '@/lib/utils'

export type BadgeColor = 'primary' | 'accent' | 'muted' | 'destructive'

export const getBadgeClasses = (badgeColor: BadgeColor) => {
  const baseClasses = 'inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold transition-all border'
  const colorMap: Record<BadgeColor, string> = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    accent: 'bg-accent/10 text-accent border-accent/20',
    muted: 'bg-muted text-muted-foreground border-border',
    destructive: 'bg-destructive/10 text-destructive border-destructive/20',
  }
  return cn(baseClasses, colorMap[badgeColor])
}
