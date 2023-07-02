import { defineStore } from 'pinia'
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore'
import { Pocket } from '~/interfaces/finance'
import { useUserStore } from '~/stores/user'
import { normalizeString } from '~/helpers/transforms'

export const useFinanceStore = defineStore('financeStore', () => {
  const { $db } = useNuxtApp()
  const userStore = useUserStore()

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

  async function cratePocket (pocket: Pocket): Promise<void> {
    try {
      pockets.isCreating = true
      const id = normalizeString(pocket.name, ['trim', 'toLowerCase', 'replaceAll| |_'])
      const data = { name: pocket.name, amount: pocket.amount }
      await setDoc(doc($db, `${userStore.user.email}/finance/pockets/${id}`), data)
    } catch (err) {
      // console.error(err)
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
      const { $db } = useNuxtApp()
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

  return {
    cratePocket,
    deletePocket,
    getPockets,
    pockets,
    pocketToEdit,
    setPocketToEdit,
    showPocketModal,
    totalBalance
  }
})
