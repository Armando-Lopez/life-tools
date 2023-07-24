export interface Goal {
  created: string
  currentAmount: number | null
  description?: string
  finalAmount: number | null
  id: string
  name: string
  path?: string
}

export interface Pocket {
  amount: number
  created?: string
  id?: string
  name: string
  path?: string
}

export interface TransactionInput {
  amount: number
  created?: string
  description?: string
  id?: string
  pocketId: string
  scheduledTo?: string
  type: string
}
