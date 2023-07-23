import { defineStore } from 'pinia'
import { deleteDoc, doc, setDoc, updateDoc } from 'firebase/firestore'
import dayjs from 'dayjs'
import { Goal, Pocket } from '~/interfaces/finance'
import { useUserStore } from '~/stores/user'
import { generateId } from '~/helpers'
import { useFirestore } from '~/composables/useFirestore'

export const useFinanceStore = defineStore('financeStore', () => {
  const { getDocs } = useFirestore()
  const { $db } = useNuxtApp()
  const userStore = useUserStore()

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
  const pocketsNames = computed(() =>
    pockets.data.map((pocket: Pocket) => pocket.name)
  )
  watch(showPocketModal, (newValue: Boolean) => {
    if (!newValue) {
      pocketToEdit.isSaving = false
      pocketToEdit.data = <Pocket>{}
    }
  })

  async function cratePocket (pocket: Pocket): Promise<boolean> {
    try {
      pockets.isCreating = true
      const id = generateId()
      const data = {
        id,
        name: pocket.name,
        amount: pocket.amount,
        created: dayjs().format('YYYY-MM-DD HH:mm:ss')
      }
      await setDoc(doc($db, `${userStore.user.email}/finance/pockets/${id}`), data)
      return true
    } catch (err) {
      console.error(err)
      return false
    } finally {
      pockets.isCreating = false
    }
  }

  async function getPockets () {
    pockets.isLoading = true
    const { success } = await getDocs(`${userStore.user.email}/finance/pockets`)
    success((data: any) => (pockets.data = data))
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
      await setDoc(doc($db, `${userStore.user.email}/finance/goals/${id}`), data)
      return true
    } catch (err) {
      console.error(err)
      return false
    } finally {
      pockets.isCreating = false
    }
  }
  async function getGoals () {
    const { success } = await getDocs(`${userStore.user.email}/finance/goals`)
    success((data: any) => (goals.data = data))
  }
  // GOALS--->

  // <---TRANSACTIONS

  // TRANSACTIONS--->

  return {
    goals,
    pocketToEdit,
    pockets,
    pocketsNames,
    showPocketModal,
    totalBalance,
    cratePocket,
    createGoal,
    deletePocket,
    getGoals,
    getPockets,
    setPocketToEdit,
    updatePocket
  }
})
