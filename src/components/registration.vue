<template>
  <v-container>
    <v-form @submit.prevent="registerUser">
      <v-card>
        <v-card-title class="headline">User Registration</v-card-title>
        <v-card-text>
          <v-text-field
            label="First Name"
            v-model="user.firstName"
            :rules="nameRules"
            required
          ></v-text-field>
          <v-text-field
            label="Last Name"
            v-model="user.lastName"
            :rules="nameRules"
            required
          ></v-text-field>

          <v-text-field
            label="Email"
            v-model="user.email"
            :rules="emailRules"
            required
          ></v-text-field>

          <v-text-field
            label="Password"
            v-model="user.password"
            :rules="passwordRules"
            type="password"
            required
          ></v-text-field>

          <v-text-field
            label="Confirm Password"
            v-model="user.confirmPassword"
            :rules="confirmPasswordRules"
            type="password"
            required
          ></v-text-field>
        </v-card-text>

        <v-card-actions>
          <v-btn color="primary" type="submit">Register</v-btn>
          <v-btn color="error" @click="resetForm">Reset</v-btn>
        </v-card-actions>
      </v-card>
    </v-form>
       <!-- Snackbar for success message -->
    <v-snackbar v-model="showSuccessSnackbar" color="success">
      {{ successMessage }}
    </v-snackbar>
    
    <!-- Snackbar for error message -->
    <v-snackbar v-model="showErrorSnackbar" color="error">
      {{ errorMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import router from '../Router/index'

const showSuccessSnackbar = ref(false);
const showErrorSnackbar = ref(false);
const successMessage = ref('');
const errorMessage = ref('');

const user = ref({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: ''
})


const registerUser = async () => {
  const userData = user.value;
  if (validateForm(userData)) {
    try {
      const response = await axios.post('http://localhost:5000/api/register', userData)

      if (response.status === 200) {
        // Registration success
  alert("Registered Successfully !")
        router.push('/')
      } else if (response.status === 400) {
        // User already exists
        alert('User already exists. Please log in to proceed.');
  
      }
    } catch (error) {
      console.error('Error registering user:', error);
      errorMessage.value = 'Error registering user.';
      showErrorSnackbar.value = true;
    }
  }
}
const resetForm = () => {
  user.value = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  }
}

const nameRules = [
  (v) => !!v || 'Name is required',
  (v) => (v && v.length >= 3) || 'Name must be at least 3 characters'
]

const emailRules = [
  (v) => !!v || 'E-mail is required',
  (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid'
]

const passwordRules = [
  (v) => !!v || 'Password is required',
  (v) => (v && v.length >= 6) || 'Password must be at least 6 characters'
]

const confirmPasswordRules = [
  (v) => !!v || 'Confirm Password is required',
  (v) => v === user.value.password || 'Passwords must match'
]

const validateForm = (userData) => {
  const validationRules = {
    firstName: nameRules,
    lastName: nameRules,
    email: emailRules,
    password: passwordRules,
    confirmPassword: confirmPasswordRules
  }

  for (const field in userData) {
    for (const rule of validationRules[field]) {
      if (!rule(userData[field])) {
        return false
      }
    }
  }

  return true
}
</script>
