import { defineStore } from 'pinia'
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import dayjs from 'dayjs'
import { CalendarTask, Task } from '~/interfaces/tasksTracking'
import { generateId } from '~/helpers'
import { useUserStore } from '~/stores/user'

export const useTasksTrackingStore = defineStore('taskTrackingStore', () => {
  const { $db } = useNuxtApp()
  const userStore = useUserStore()
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
      const id = generateId()
      const taskData = { id, ...task }
      const path = `${userStore.user.email}/tasks-tracking/tasks/${id}`
      await setDoc(doc($db, path), taskData)
      tasks.data.push({ ...taskData, path })
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  async function getTasks () {
    try {
      tasks.isLoading = true
      const docs = await getDocs(collection($db, `${userStore.user.email}/tasks-tracking/tasks`))
      tasks.data = []
      docs.forEach((doc) => {
        tasks.data.push({ ...doc.data() as Task, path: doc.ref.path })
      })
    } catch (err) {
      // console.error(err)
    } finally {
      tasks.isLoading = false
    }
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

      request.execute(async (event: any) => {
        await updateTask(taskId, {
          lastCalendarEventId: event.id
        })
      })
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
