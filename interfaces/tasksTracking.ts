export interface TimeLog {
  id: string
  meta?: any
  startedAt: string
  timeSpentSeconds: number
  jiraWorkLogId?: string | number
}

export interface QuickTimeLogger {
  duration: string
  hasTodayWorkLog?: boolean
  id?: string
  mode: string
  name: '' | 'PRE' | 'MAN' | 'AUT'
  startAt: string
}

export interface Task {
  code: string
  description?: string
  id?: string
  isPinned?: boolean
  name?: string
  meta?: any
  path?: string
  quickLoggers?: object
  timeLogs?: object
  trackingSeconds?: number
  created?: string
}

export interface CalendarTask {
  description?: string
  end?: string
  id?: string
  start?: string
  summary?: string
}
