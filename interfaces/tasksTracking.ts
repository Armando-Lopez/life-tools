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
  mode: 'AUT' | 'MAN'
  name: string
  startAt: string
}

export interface Task {
  code: string
  description?: string
  id?: string
  isPinned?: boolean
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
