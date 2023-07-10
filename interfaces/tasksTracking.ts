interface Tracking {
  id: string
  start: string
  end: string
}

export interface Task {
  id?: string
  lastCalendarEventId?: string
  name?: string
  description?: string
  trackingSeconds?: number
  tracking?: Array<Tracking>
  path?: string
}

export interface CalendarTask {
  id?: string
  summary?: string
  description?: string
  start?: string
  end?: string
}
