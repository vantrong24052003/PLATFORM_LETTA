export interface GradeOption {
  value: string
  label: string
  point: number
  badgeColor: string
  category: string
  status: 'pass' | 'conditional' | 'fail'
}

export const GRADE_OPTIONS: GradeOption[] = [
  {
    value: 'A+',
    label: 'A+',
    point: 4.0,
    badgeColor: 'primary',
    category: 'excellent',
    status: 'pass',
  },
  {
    value: 'A',
    label: 'A',
    point: 4.0,
    badgeColor: 'primary',
    category: 'excellent',
    status: 'pass',
  },
  {
    value: 'A-',
    label: 'A−',
    point: 3.65,
    badgeColor: 'primary',
    category: 'good',
    status: 'pass',
  },
  {
    value: 'B+',
    label: 'B+',
    point: 3.33,
    badgeColor: 'accent',
    category: 'good',
    status: 'pass',
  },
  {
    value: 'B',
    label: 'B',
    point: 3.0,
    badgeColor: 'accent',
    category: 'good',
    status: 'pass',
  },
  {
    value: 'B-',
    label: 'B−',
    point: 2.65,
    badgeColor: 'accent',
    category: 'average',
    status: 'pass',
  },
  {
    value: 'C+',
    label: 'C+',
    point: 2.33,
    badgeColor: 'muted',
    category: 'average',
    status: 'pass',
  },
  {
    value: 'C',
    label: 'C',
    point: 2.0,
    badgeColor: 'muted',
    category: 'average',
    status: 'pass',
  },
  {
    value: 'C-',
    label: 'C−',
    point: 1.65,
    badgeColor: 'muted',
    category: 'average',
    status: 'pass',
  },
  {
    value: 'D',
    label: 'D',
    point: 1.0,
    badgeColor: 'muted',
    category: 'averageWeak',
    status: 'pass',
  },
]

export const getGradeByValue = (value: string): GradeOption | undefined => {
  return GRADE_OPTIONS.find((grade) => grade.value === value)
}
