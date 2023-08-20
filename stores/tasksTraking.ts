import { defineStore } from 'pinia'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import dayjs from 'dayjs'
import { CalendarTask, Task } from '~/interfaces/tasksTracking'
import { TRACKING_TASKS_PATH } from '~/constants/firebaseConstants'

export const useTasksTrackingStore = defineStore('taskTrackingStore', () => {
  const { $db } = useNuxtApp()
  const { createDoc, getDocs } = useFirestore()

  const tasks = reactive({
    isLoading: false,
    data: <Task[]>[]
  })
  const currentTaskId = ref<string | null>(null)
  const hasCalendarAccess = ref(false)

  function setCalendarAccess (hasAccess: boolean) {
    hasCalendarAccess.value = hasAccess
  }
  function setCurrentTaskId (taskId: string | null) {
    currentTaskId.value = taskId
  }
  async function createTask (task: Task): Promise<Boolean> {
    try {
      const { data } = await createDoc(TRACKING_TASKS_PATH, task)
      tasks.data.push(data as Task)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  async function getTasks () {
    tasks.isLoading = true
    const { data } = await getDocs(TRACKING_TASKS_PATH)
    if (data) {
      tasks.data = data
    }
    tasks.isLoading = false
  }
  async function updateTask (taskId: string | undefined, newData: Task) {
    if (!taskId) { return false }
    try {
      const task = tasks.data.find((t: Task) => t.id === taskId) as Task
      // @ts-ignore
      const docRef = doc($db, task.path)
      await updateDoc(docRef, newData as any)
      for (const newDataKey in newData) {
        // @ts-ignore
        task[newDataKey] = newData[newDataKey]
      }
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  async function deleteTask (taskId: string | null): Promise<Boolean> {
    try {
      if (!taskId) {
        return false
      }
      const { path } = tasks.data.find((t: Task) => t.id === taskId) as Task
      // @ts-ignore
      await deleteDoc(doc($db, path))
      tasks.data = tasks.data.filter(t => t.id !== taskId)
      return true
    } catch (err) {
      return false
    }
  }
  function createCalendarTaskEvent (taskId: string | undefined, calendarTask: CalendarTask) {
    try {
      if (!taskId) { return false }
      const now = dayjs()
      // @ts-ignore
      const request = gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: {
          summary: calendarTask.summary,
          description: calendarTask.description,
          start: { dateTime: now },
          end: { dateTime: now.add(1, 'minute') },
          reminders: { useDefault: false },
          colorId: 8
        }
      })
      console.log(request)
      // request.execute(async (event: any) => {
      //   await updateTask(taskId, {
      //     lastCalendarEventId: event.id
      //   })
      // })
    } catch (e) {
      console.error(e)
    }
  }
  function getCalendarTaskEvent (calendarTaskId: string, cb?: Function) {
    try {
      // @ts-ignore
      const request = gapi.client.calendar.events.get({
        calendarId: 'primary',
        eventId: calendarTaskId
      })
      request.execute((result: any) => result?.id && cb?.(result))
    } catch (e) {
      console.error(e)
    }
  }
  function updateCalendarTaskEvent (calendarTaskId: string, cb?: Function) {
    try {
      getCalendarTaskEvent(calendarTaskId, (event: any) => {
        const now = dayjs()
        // @ts-ignore
        const request = gapi.client.calendar.events.update({
          calendarId: 'primary',
          eventId: calendarTaskId,
          resource: {
            ...event,
            end: { dateTime: now }
          }
        })
        request.execute((result: any) => cb?.(result))
      })
    } catch (e) {
      console.error(e)
    }
  }

  return {
    tasks,
    currentTaskId,
    hasCalendarAccess,
    setCalendarAccess,
    deleteTask,
    createTask,
    getTasks,
    updateTask,
    setCurrentTaskId,
    createCalendarTaskEvent,
    updateCalendarTaskEvent
  }
})
