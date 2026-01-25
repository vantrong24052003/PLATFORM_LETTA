export interface GraduationClassification {
  rankKey: string
  minGpa: number
  maxGpa: number
  badgeColor: string
  iconName: string
}

export interface CreditDistribution {
  id: string
  credits: number
  gradeValue: string
}

export interface ScoreComponent {
  id: string
  name: string
  weight: number
  score: number
}

export interface PassResultPrediction {
  finalScore: number | null
  letterGrade: string | null
  gpa4: number | null
  badgeColor: string | null
  status: 'pass' | 'fail' | null
}

export interface PassResult {
  requiredFinalScore: number | null
  canPass: boolean | null
  currentScore: number | null
  currentTotalWeight: number | null
  remainingWeight: number | null
  formula: string | null
  predictionResult: PassResultPrediction | null
}

export interface TargetResult {
  maxGpaWithAllA: number | null
  canReachTargetWithAllA: boolean | null
  graduationClassification: GraduationClassification | null
}

export interface SimulationResult {
  finalGpa: number | null
  remainingGpa: number | null
  graduationClassification: GraduationClassification | null
  distributionSummary: string | null
  totalCredits: number | null
  isWeakResult: boolean
}

export interface PeResult {
  average: number | null
  isPass: boolean | null
  inputs: { pe1: number; pe2: number; pe3: number } | null
}
