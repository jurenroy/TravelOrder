import { defineStore } from 'pinia';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => {
    const savedUserData = localStorage.getItem('userData');
    return {
      account_id: null,
      account_type: null,
      name_id: null,
      signature: null,
      isLoggedIn: false,
      password: null,
      email: null,
      ...savedUserData ? JSON.parse(savedUserData) : {},
    };
  },
  actions: {
    login(accountId, accountType, nameId, signature, password, email) {
      this.account_id = accountId; // Set account_id
      this.account_type = accountType;
      this.name_id = nameId; // Set name_id
      this.signature = signature; // Set signature
      this.password = password; // Set password
      this.email = email;
      this.isLoggedIn = true; // Set logged-in status
      this.saveToLocalStorage(); // Save to localStorage
      console.log('saved')
    },
    logout() {
      this.account_id = null; // Clear account_id
      this.account_type = null;
      this.name_id = null; // Clear name_id
      this.signature = null; // Clear signature
      this.password = null; // Clear password
      this.email = null;
      this.isLoggedIn = false; // Set logged-out status
      this.saveToLocalStorage(); // Save to localStorage
    },
    changePassword(newPassword) {
      this.password = newPassword; // Update the password
      this.saveToLocalStorage(); // Save the updated user data to localStorage
      console.log('Password changed successfully');
    },
    changeSignature(newSignature) {
      this.signature = newSignature; // Update the Signature
      this.saveToLocalStorage(); // Save the updated user data to localStorage
      console.log('Signature changed successfully');
    },
    saveToLocalStorage() {
      localStorage.setItem('userData', JSON.stringify({
        account_id: this.account_id,
        account_type: this.account_type,
        name_id: this.name_id,
        signature: this.signature,
        isLoggedIn: this.isLoggedIn,
        password: this.password, // Save password
        email: this.email,
      }));
    },
  },
});