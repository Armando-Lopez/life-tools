import {
  collection,
  doc,
  getDoc as getFirebaseDoc,
  getDocs as getFirebaseDocs,
  setDoc,
  updateDoc as updateFirebaseDoc,
  arrayUnion,
  query as firebaseQuery,
  deleteDoc as deleteFirebaseDoc
} from 'firebase/firestore'
import dayjs from 'dayjs'
import { generateId } from '~/helpers'
import { useUserStore } from '~/stores/user'

export const useFirestore = () => {
  const { $db } = useNuxtApp()
  const userStore = useUserStore()
  const isLoading = ref<boolean>(false)

  const toggleLoading = (): boolean => (isLoading.value = !isLoading.value)

  const createDoc = async (path: string, values: Object) => {
    try {
      toggleLoading()
      const id = generateId()
      // @ts-ignore
      const data = {
        created: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        updated: dayjs().format('YYYY-MM-DD HH:mm:ss'),
        ...values
      }
      // @ts-ignore
      await setDoc(doc($db, `${userStore.user.email}/${path}/${id}`), data)
      return { data: { ...data, id }, error: null }
    } catch (error) {
      console.error(error)
      return { error, data: null }
    } finally {
      toggleLoading()
    }
  }

  const createDocOrUpdateIfExists = async (path: string, values: Object) => {
    try {
      toggleLoading()
      // @ts-ignore
      await setDoc(doc($db, `${userStore.user.email}/${path}`), values, { merge: true })
      return { data: { values }, error: null }
    } catch (error) {
      console.error(error)
      return { error, data: null }
    } finally {
      toggleLoading()
    }
  }

  const getDoc = async (path: string) => {
    try {
      toggleLoading()
      // @ts-ignore
      const docSnap = await getFirebaseDoc(doc($db, `${userStore.user.email}/${path}`))
      let data: any = null
      if (docSnap.exists()) {
        data = {
          ...docSnap.data(),
          id: docSnap.id,
          path: docSnap.ref.path
        }
      }
      return { data, error: null }
    } catch (error) {
      console.error(error)
      return { error, data: null }
    } finally {
      toggleLoading()
    }
  }

  const getDocs = async (path: string, query: Array<any> = []) => {
    try {
      toggleLoading()
      const data = <any>[]
      const docs = await getFirebaseDocs(firebaseQuery(
        // @ts-ignore
        collection($db, `${userStore.user.email}/${path}`),
        ...query
      ))
      docs.forEach((doc: any) => {
        data.push({
          ...doc.data(),
          id: doc.id,
          path: doc.ref.path
        })
      })
      return { data, error: null }
    } catch (error) {
      console.error(error)
      return { error, data: null }
    } finally {
      toggleLoading()
    }
  }

  const updateDoc = async (path: string, values: object) => {
    try {
      toggleLoading()
      // @ts-ignore
      const docRef = doc($db, path)
      await updateFirebaseDoc(docRef, {
        ...values,
        updated: dayjs().format('YYYY-MM-DD HH:mm:ss')
      })
      return { data: docRef, error: null }
    } catch (error) {
      console.error(error)
      return { error, data: null }
    } finally {
      toggleLoading()
    }
  }

  async function deleteDoc (path: string): Promise<Boolean> {
    try {
      if (!path) { return false }
      await deleteFirebaseDoc(doc($db, path))
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }

  return {
    addToArray: arrayUnion,
    createDoc,
    createDocOrUpdateIfExists,
    deleteDoc,
    getDoc,
    getDocs,
    isLoading,
    updateDoc
  }
}
