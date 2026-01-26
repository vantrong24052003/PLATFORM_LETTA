import type { GraduationClassification } from '@/types/gpa'

export const GRADUATION_CLASSIFICATIONS: GraduationClassification[] = [
  {
    rankKey: 'excellent',
    minGpa: 3.6,
    maxGpa: 4.0,
    badgeColor: 'primary',
    iconName: 'Star',
  },
  {
    rankKey: 'good',
    minGpa: 3.2,
    maxGpa: 3.59,
    badgeColor: 'primary',
    iconName: 'GraduationCap',
  },
  {
    rankKey: 'fair',
    minGpa: 2.5,
    maxGpa: 3.19,
    badgeColor: 'accent',
    iconName: 'BookOpen',
  },
  {
    rankKey: 'average',
    minGpa: 2.0,
    maxGpa: 2.49,
    badgeColor: 'muted',
    iconName: 'FileText',
  },
  {
    rankKey: 'poor',
    minGpa: 0,
    maxGpa: 1.99,
    badgeColor: 'destructive',
    iconName: 'AlertTriangle',
  },
]
