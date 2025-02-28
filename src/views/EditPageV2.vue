<template>
    <div class="overlay" v-if="showPopup">
        <div class="popup">
            <label class="title">Change Password</label>
            
            <div class="form-group">
                <h1 class="name-text">{{ name.first_name }} {{ name.middle_init }} {{ name.last_name }}</h1>
            </div>

            <div class="form-group">
                <label class="updatelabel">Username:</label>
                <input type="text" v-model="account.email" class='updateinput' id='username' readonly>
            </div>

            <div class="form-group">
                <label class="updatelabel">Enter Old Password:</label>
                <input 
                    type="password" 
                    v-model="oldPassword" 
                    class='updateinput' 
                    id='oldPassword' 
                    :class="{ 'error-border': !isOldPasswordValid }" 
                    required
                >
            </div>

            <div class="form-group">
                <label class="updatelabel">Enter New Password:</label>
                <input 
                    type="password" 
                    v-model="newPassword" 
                    class='updateinput' 
                    id='newPassword' 
                    :disabled="!isOldPasswordValid" 
                    :class="{ 'valid-border': isOldPasswordValid && newPassword, 'error-border': !newPassword && !isOldPasswordValid }" 
                    required
                >
            </div>

            <div class="button-group">
                <button 
                class="submit-button" 
                @click="updateAccount" 
                :disabled="!newPassword"
                :class="{ 'disabled-button': !newPassword }"
            >
                Update
            </button>
            <button class="close-button" @click="closePopup">Close</button>
            </div>
            

            <div v-if="isLoading" class="loader">Loading...</div>
            <div v-if="errorMessage" class="error-message">{{ errorMessage }}</div>
            <div v-if="successMessage" class="success-message">{{ successMessage }}</div>

            
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import CryptoJS from 'crypto-js';
import { API_BASE_URL } from '@/config';
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/store/auth'; // Adjust the path as necessary

const router = useRouter();
const authStore = useAuthStore(); // Use the store


const showPopup = ref(true); // Control the visibility of the popup
const name = ref({ first_name: '', middle_init: '', last_name: '' });
const account = ref({ email: '', password: '', account_id: '' });
const oldPassword = ref('');
const newPassword = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const isOldPasswordValid = computed(() => {
    const decryptedPassword = CryptoJS.AES.decrypt(account.value.password, 'jUr3ñr0yR@br4g@n').toString(CryptoJS.enc.Utf8);
    return decryptedPassword === oldPassword.value;
});

const fetchAccountData = async () => {
    try {
        const nameId = authStore.name_id;
        const accountResponse = await axios.get(`${API_BASE_URL}/get_accounts_json/${nameId}`);
        account.value = accountResponse.data;

        const nameResponse = await axios.get(`${API_BASE_URL}/get_names_json/${nameId}`);
        name.value = nameResponse.data;
    } catch (error) {
        console.error('Error fetching account or name data:', error);
    }
};

onMounted(() => {
    fetchAccountData();
});

const updateAccount = async () => {
    isLoading.value = true;
    errorMessage.value = '';
    successMessage.value = '';

    try {
        const encryptedNewPassword = CryptoJS.AES.encrypt(newPassword.value, 'jUr3ñr0yR@br4g@n').toString();
        const data = { password: encryptedNewPassword };
        const accountId = account.value.account_id;
        await axios.post(`${API_BASE_URL}/update_account/${accountId}`, data);
        authStore.changePassword(encryptedNewPassword); // Call the changePassword action
        successMessage.value = 'Account updated successfully!';
        setTimeout(() => {
            router.push('/');
        }, 2000);
    } catch (error) {
        errorMessage.value = 'Failed to update account. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

const closePopup = () => {
    showPopup.value = false; // Close the popup
    router.push('/')
};
</script>

<style>
.overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.7); /* Dark overlay */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it is on top */
}

.popup {
    background: linear-gradient(180deg, #f0c36d, #b8860b); /* Gradient from light gold to dark gold */
    border-radius: 20px; /* Rounded corners */
    padding: 40px; /* Increased padding for a spacious feel */
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2); /* Deeper shadow for elegance */
    width: 90%; /* Full width on mobile */
    max-width: 500px; /* Max width */
    text-align: center;
}

.title {
    margin-bottom: 30px; /* Increased margin for spacing */
    font-weight: bold;
    font-size: 36px; /* Larger font size for emphasis */
    color: #4A4A4A; /* Darker text color for luxury */
}

.form-group {
    margin-bottom: 25px; /* Increased margin for spacing */
    width: 100%; /* Full width */
}

.updatelabel {
    font-size: 18px; /* Slightly larger font size */
    color: #555; /* Slightly lighter text color */
}

.updateinput {
    font-size: 16px;
    border-radius: 5px;
    width: 100%; /* Full width */
    height: 45px; /* Increased height for comfort */
    padding: 12px; /* Padding inside input */
    border: 1px solid #ccc; /* Light border */
    transition: border-color 0.3s, box-shadow 0.3s; /* Smooth transition */
}

.updateinput:focus {
    border-color: #007bff; /* Change border color on focus */
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Subtle glow effect */
    outline: none; /* Remove default outline */
}

.error-border {
    border-color: red; /* Red border for invalid input */
}

.valid-border {
    border-color: green; /* Green border for valid input */
}

.name-text {
    font-size: 28px; /* Larger font size for name */
    font-weight: bold;
    color: #333; /* Darker text color */
}

.submit-button {
    background-color: #0e0e0e; /* Primary button color */
    color: white; /* Text color */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded corners */
    padding: 12px 20px; /* Padding for button */
    font-size: 18px; /* Larger font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s, transform 0.2s; /* Smooth transition */
}

.submit-button:hover {
    background-color: #707070; /* Darker shade on hover */
    transform: translateY(-2px); /* Slight lift effect */
}

.enabled-button {
    background-color: #007bff; /* Primary button color */
    color: white; /* Text color */
    cursor: pointer; /* Pointer cursor on hover */
}

.disabled-button {
    background-color: #d3d3d3; /* Pale background color */
    color: #a9a9a9; /* Pale text color */
    cursor: not-allowed; /* Not allowed cursor */
}

/* Loader styles */
.loader {
    text-align: center;
    font-size: 1.5em;
    color: #007bff; /* Loader color */
    margin-top: 10px; /* Space above loader */
}

/* Error and success message styles */
.error-message {
    color: red;
    margin-top: 10px;
    font-weight: bold; /* Bold for emphasis */
}

.success-message {
    color: green;
    margin-top: 10px;
    font-weight: bold; /* Bold for emphasis */
}

/* Close button styles */
.close-button {
    background-color: #ff0000; /* Primary button color */
    color: white; /* Text color */
    border: none; /* Remove border */
    border-radius: 5px; /* Rounded corners */
    padding: 12px 20px; /* Padding for button */
    font-size: 18px; /* Larger font size */
    cursor: pointer; /* Pointer cursor on hover */
    transition: background-color 0.3s, transform 0.2s; /* Smooth transition */
}

.close-button:hover {
    background-color: #b35100; /* Darker shade on hover */
    transform: translateY(-2px); /* Slight lift effect */
}

.button-group{
    display: flex;
    justify-content: space-around;
}
</style>