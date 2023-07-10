import { defineStore } from 'pinia'
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore'
import dayjs from 'dayjs'
import { Goal, Pocket } from '~/interfaces/finance'
import { useUserStore } from '~/stores/user'
import { generateId } from '~/helpers'

export const useFinanceStore = defineStore('financeStore', () => {
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

  async function getPockets () {
    try {
      pockets.isLoading = true
      const docs = await getDocs(collection($db, `${userStore.user.email}/finance/pockets`))
      pockets.data = []
      docs.forEach((doc) => {
        const { name, amount } = doc.data()
        pockets.data.push({ id: doc.id, amount, name, path: doc.ref.path })
      })
    } catch (err) {
      // console.error(err)
    } finally {
      pockets.isLoading = false
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async function crateGoal (goal: Goal): Promise<boolean> {
    try {
      goals.isCreating = true
      const id = generateId()
      const data = {
        id,
        name: goal.name,
        amount: goal.finalAmount,
        currentAmount: 0,
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
  // GOALS--->

  // <---TRANSACTIONS

  // TRANSACTIONS--->

  return {
    cratePocket,
    deletePocket,
    getPockets,
    goals,
    pocketToEdit,
    pockets,
    pocketsNames,
    setPocketToEdit,
    showPocketModal,
    totalBalance,
    updatePocket
  }
})
