import { defineStore } from 'pinia'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { collection, doc, getDoc, getDocs } from 'firebase/firestore'

export const useFinanceStore = defineStore('finance', {
  state: () => ({
    totalBalance: 0
  }),
  actions: {
    async getBalance () {
      const { $db } = useNuxtApp()
      const docRef = await getDoc(doc($db, 'diego/finance'))
      this.totalBalance = docRef.exists() ? docRef.data().total_balance : 0
      console.log(this.totalBalance)
    },
    async getTransactions () {
      const { $db } = useNuxtApp()
      const docRef = await getDocs(collection($db, 'diego/finance/transactions'))
      docRef.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, ' => ', doc.data())
      })
      // const querySnapshot = await getDocs(collection($db, 'diego/finance'))
      // querySnapshot.forEach((doc) => {
      //   // doc.data() is never undefined for query doc snapshots
      //   console.log(doc.id, ' => ', doc.data())
      // })
      // console.log(docRef.exists())
      // console.log(docRef.data())
    }
  }
})
