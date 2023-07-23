import { collection, doc, getDocs as getData, setDoc } from 'firebase/firestore'
import dayjs from 'dayjs'
import { generateId } from '~/helpers'

export const useFirestore = () => {
  const { $db } = useNuxtApp()
  const createDoc = async (path: string, values: Object) => {
    try {
      const id = generateId()
      const data = {
        ...values,
        id,
        created: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      await setDoc(doc($db, `${path}/${id}`), data)
      return {
        success: (cb: Function) => cb?.(data),
        error: (cb: Function) => cb?.()
      }
    } catch (error) {
      return {
        success: (cb: Function) => cb?.(),
        error: (cb: Function) => cb?.(error)
      }
    }
  }

  const getDocs = async (path: string) => {
    try {
      const data = <any>[]
      // @ts-ignore
      const docs = await getData(collection($db, path))
      // @ts-ignore
      docs.forEach((doc: any) => {
        data.push({
          ...doc.data(),
          id: doc.id,
          path: doc.ref.path
        })
      })
      return {
        success: (cb: Function) => cb?.(data),
        error: (cb: Function) => cb?.()
      }
    } catch (error) {
      return {
        success: (cb: Function) => cb?.(),
        error: (cb: Function) => cb?.(error)
      }
    }
  }
  return {
    createDoc,
    getDocs
  }
}
