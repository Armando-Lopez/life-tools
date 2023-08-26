export interface TimeLog {
  id: string
  meta?: any
  startedAt: string
  timeSpentSeconds: number
  jiraWorkLogId?: string | number
}

export interface QuickTimeLogger {
  duration: string
  name: string
  time: string
}

export interface Task {
  code: string
  description?: string
  id?: string
  isPinned?: boolean
  name?: string
  meta?: any
  path?: string
  quickLoggers?: QuickTimeLogger
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
