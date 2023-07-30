import {
  collection,
  doc,
  getDoc as getFirebaseDoc,
  getDocs as getFirebaseDocs, serverTimestamp,
  setDoc,
  updateDoc as updateFirebaseDoc,
  arrayUnion,
  orderBy,
  query as firebaseQuery
} from 'firebase/firestore'
import dayjs from 'dayjs'
import { generateId } from '~/helpers'
import { useUserStore } from '~/stores/user'

interface Query {
  orderBy: Array<string>
}

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
        timestamp: serverTimestamp(),
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

  const getDocs = async (path: string, query?: Query) => {
    try {
      toggleLoading()
      const data = <any>[]
      const docs = await getFirebaseDocs(firebaseQuery(
        // @ts-ignore
        collection($db, `${userStore.user.email}/${path}`),
        // @ts-ignore
        query?.orderBy && orderBy(...query.orderBy)
      ))
      // @ts-ignore
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
      const docRef = doc($db, `${userStore.user.email}/${path}`)
      await updateFirebaseDoc(docRef, {
        ...values,
        timestamp: serverTimestamp()
      })
      return { data: docRef, error: null }
    } catch (error) {
      console.error(error)
      return { error, data: null }
    } finally {
      toggleLoading()
    }
  }

  return {
    isLoading,
    addToArray: arrayUnion,
    createDoc,
    createDocOrUpdateIfExists,
    getDoc,
    getDocs,
    updateDoc
  }
}
