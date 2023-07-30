import { defineStore } from 'pinia'
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import dayjs from 'dayjs'
import { Goal, Pocket } from '~/interfaces/finance'
import { generateId } from '~/helpers'
import { useFirestore } from '~/composables/useFirestore'
import { GOALS_PATH, POCKETS_PATH } from '~/constants/firebaseConstants'

export const useFinanceStore = defineStore('financeStore', () => {
  const { getDocs } = useFirestore()
  const { $db } = useNuxtApp()

  // <---POCKETS
  const pockets = reactive({
    isLoading: false,
    isCreating: false,
    data: <Pocket[]>[]
  })
  const pocketToEdit = reactive({
    isSaving: false,
    data: <Pocket>{}
  })
  const showPocketModal = ref<Boolean>(false)
  const totalBalance = computed<number>((): number =>
    pockets.data.reduce((acc: number, pocket: Pocket) => pocket.amount + acc, 0)
  )
  watch(showPocketModal, (newValue: Boolean) => {
    if (!newValue) {
      pocketToEdit.isSaving = false
      pocketToEdit.data = <Pocket>{}
    }
  })

  async function getPockets () {
    pockets.isLoading = true
    const { data } = await getDocs(POCKETS_PATH)
    if (data) {
      pockets.data = data
    }
    pockets.isLoading = false
  }

  async function deletePocket (path: string | null): Promise<boolean> {
    try {
      if (!path) {
        return false
      }
      await deleteDoc(doc($db, path))
      return true
    } catch (err) {
      return false
    }
  }

  function setPocketToEdit (pocket : Pocket) {
    showPocketModal.value = true
    pocketToEdit.data = pocket
  }

  async function updatePocket (path: string | undefined, data: Pocket): Promise<boolean> {
    if (!path) { return false }
    try {
      // @ts-ignore
      const docRef = doc($db, path)
      await updateDoc(docRef, data as any)
      return true
    } catch (err) {
      console.error(err)
      return false
    }
  }
  // POCKETS--->

  // <---GOALS
  const goals = reactive({
    isLoading: false,
    isCreating: false,
    data: <Goal[]>[]
  })
  async function createGoal (goal: Goal): Promise<boolean> {
    try {
      goals.isCreating = true
      const id = generateId()
      const data = <Goal>{
        ...goal,
        id,
        created: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      await setDoc(doc($db, `${GOALS_PATH}/${id}`), data)
      return true
    } catch (err) {
      console.error(err)
      return false
    } finally {
      pockets.isCreating = false
    }
  }
  async function getGoals () {
    const { data } = await getDocs(GOALS_PATH)
    if (data) {
      goals.data = data
    }
  }
  // GOALS--->

  // <---TRANSACTIONS

  // TRANSACTIONS--->

  return {
    goals,
    pocketToEdit,
    pockets,
    showPocketModal,
    totalBalance,
    createGoal,
    deletePocket,
    getGoals,
    getPockets,
    setPocketToEdit,
    updatePocket
  }
})
