<template>
  <v-container>
    <v-row>
      <v-col cols="12">
        <v-card style="display: flex;">
          <v-img src="/src/assets/main-img.jpg" alt="Your Image" contain max-width="600px" max-height="500px" />
          <v-card-text>
            <v-form @submit.prevent="loginUser">
              <v-card-title class="headline">User Login</v-card-title>
              <v-card-text>
                <v-text-field label="Email" v-model="user.email" required></v-text-field>
                <v-text-field label="Password" v-model="user.password" type="password" required></v-text-field>
              </v-card-text>

              <v-card-actions>
                <v-btn color="primary" type="submit">Login</v-btn>
                <v-btn @click="redirectToRegister" color="info">Register Now</v-btn>
              </v-card-actions>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-snackbar v-model="showSnackbar" :color="snackbarColor">
      {{ snackbarMessage }}
    </v-snackbar>
  </v-container>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const user = ref({
  email: '',
  password: '',
});

const router = useRouter();
const showSnackbar = ref(false);
const snackbarColor = ref('error'); // Default to error color
const snackbarMessage = ref('');

const loginUser = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/login', {
      email: user.value.email,
      password: user.value.password,
    });

    if (response.status === 200 && response.data.success) {
      snackbarColor.value = 'success';
      snackbarMessage.value = 'Login successful';
      showSnackbar.value = true;
      router.push('/EmployeeList');
    } else if (response.status === 401) {
      snackbarMessage.value = 'Authentication failed. Invalid credentials.';
      showSnackbar.value = true;
    } else {
      snackbarMessage.value = 'Server error';
      showSnackbar.value = true;
    }
  } catch (error) {
    snackbarMessage.value = 'Error logging in.';
    showSnackbar.value = true;
    console.error('Error logging in:', error);
  }
};

const redirectToRegister = () => {
  router.push('/register');
}
</script>
