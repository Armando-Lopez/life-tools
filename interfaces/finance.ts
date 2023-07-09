export interface Goal {
  id: string
  name: string
  description?: string
  currentAmount: number
  finalAmount: number
  created: string
}

export interface Pocket {
  amount: number
  id?: string | number
  name: string
  path?: string
  created?: string
}
