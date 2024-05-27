import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    isLoggedIn: 'false',
    accountId: '',
    verifiedOTPs: 'false', 
  }),
  actions: {
    login(accountId) {
      this.isLoggedIn = 'true'
      this.accountId = accountId
    },
    logout() {
      this.isLoggedIn = 'false'
      this.accountId = ''
    },
    updateVerifiedOTPs(value) {
      this.verifiedOTPs = value;
    },
  },
})
