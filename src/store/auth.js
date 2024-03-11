// src/store/auth.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    isLoggedIn: false,
    accountId: '',
  }),
  actions: {
    login(accountId) {
      this.isLoggedIn = true
      this.accountId = accountId
    },
    logout() {
      this.isLoggedIn = false
      this.accountId = ''
    },
  },
})
