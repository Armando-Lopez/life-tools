export interface TimeLog {
  id: string
  meta?: any
  startedAt: string
  timeSpentSeconds: number
  jiraWorkLogId?: string | number
}

export interface Task {
  code?: string | null
  description?: string
  id?: string
  name?: string
  meta?: any
  path?: string
  timeLogs?: object
  trackingSeconds?: number
}

export interface CalendarTask {
  description?: string
  end?: string
  id?: string
  start?: string
  summary?: string
}
