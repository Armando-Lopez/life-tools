export interface Goal {
  id: string
  name: string
  description?: string | number
  currentAmount: number | null
  finalAmount: number | null
  created: string
  path?: string
}

export interface Pocket {
  amount: number
  id?: string | number
  name: string
  path?: string
  created?: string
}
