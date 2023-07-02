import { defineStore } from 'pinia'
import { collection, doc, getDocs, setDoc } from 'firebase/firestore'
import { Account } from '~/interfaces/finance'
import { useUserStore } from '~/stores/user'

export const useFinanceStore = defineStore('financeStore', () => {
  const { $db } = useNuxtApp()
  const userStore = useUserStore()
  const accounts = reactive({
    isLoading: false,
    data: <Account[]>[]
  })
  const totalBalance = computed<number>((): number =>
    accounts.data.reduce((acc: number, account: Account) => account.amount + acc, 0)
  )

  async function crateAccount (account: Account): Promise<void> {
    try {
      const { id, ...rest } = account
      await setDoc(doc($db, `${userStore.user.email}/finance/accounts/${id}`), rest)
    } catch (err) {
      console.error(err)
    }
  }

  async function getAccounts () {
    try {
      accounts.isLoading = true
      const { $db } = useNuxtApp()
      const docs = await getDocs(collection($db, `${userStore.user.email}/finance/accounts`))
      accounts.data = []
      docs.forEach((doc) => {
        const { name, amount } = doc.data()
        accounts.data.push({ id: doc.id, amount, name })
      })
    } catch (err) {
      console.error(err)
    } finally {
      accounts.isLoading = false
    }
  }

  return {
    accounts,
    crateAccount,
    getAccounts,
    totalBalance
  }
})
