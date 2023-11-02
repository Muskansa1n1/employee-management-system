<template>
  <v-container>
    <h1>Our Employees</h1>
    <v-row no-gutters>
      <v-col cols="12" sm="4">
        <v-select
          label="Filter By"
          :items="filterOptions"
          v-model="selectedFilter"
          variant="outlined"
        ></v-select>
      </v-col>
      <v-col cols="12" sm="4">
        <div v-if="selectedFilter === 'Emp ID'" class="search-bar">
          <input
            type="number"
            v-model="searchId"
            placeholder="Enter Employee ID.."
            @change="searchById(searchId)"
          />
        </div>
        <v-select
          v-else-if="selectedFilter === 'Gender'"
          label="Filter"
          :items="genderOptions"
          v-model="selectedGender"
          variant="outlined"
        ></v-select>
        <v-select
          v-else-if="selectedFilter === 'Salary'"
          label="Filter"
          :items="salaryOptions"
          v-model="selectedSalary"
          variant="outlined"
        ></v-select>
        <v-select
          v-else-if="selectedFilter === 'Department'"
          label="Filter"
          :items="departmentOptions"
          v-model="selectedDepartment"
          variant="outlined"
        ></v-select>
        <div v-else class="search-bar">
          <input type="text" v-model="searchKeyword" placeholder="Search.." />
        </div>
      </v-col>
    </v-row>
    <v-table>
      <thead>
        <tr>
          <th class="text-left">S No.</th>
          <th class="text-left">Name</th>
          <th class="text-left">Gender</th>
          <th class="text-left">Salary</th>
          <th class="text-left">Department</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(employee, index) in employeesToShow"
          :key="employee.employee_id"
        >
          <td>{{ index + 1 }}</td>
          <td>{{ employee.first_name }} {{ employee.last_name }}</td>
          <td>{{ employee.gender }}</td>
          <td>{{ employee.salary }}</td>
          <td>{{ employee.department_name }}</td>
          <v-btn variant="outlined" @click="showDetails(employee)"
            >Details</v-btn
          >
          <v-icon
            color="primary"
            style="margin-left: 10px"
            @click="updateEmployee(employee)"
            >mdi-border-color</v-icon
          >
           
          <v-icon
            color="error"
            style="margin-left: 10px"
            @click="deleteEmployee(employee)"
            >mdi-delete</v-icon
          >
        </tr>
      </tbody>
    </v-table>

        <!-- form to add new employee -->
        <v-form v-model="addEmployeeVisible" @submit.prevent="addNewEmployee">
    <v-card>
      <v-card-title class="headline">Add New Employee</v-card-title>
      <v-card-text>
        <v-text-field label="First Name" v-model="newEmployee.first_name"  required></v-text-field>
        <v-text-field label="Last Name" v-model="newEmployee.last_name" required></v-text-field>
        <v-text-field label="Date of Birth" v-model="newEmployee.date_of_birth" type="date" required></v-text-field>
        <v-select label="Gender" :items="genderOptions" v-model="newEmployee.gender" required></v-select>
        <v-text-field label="Address" v-model="newEmployee.address" required></v-text-field>
        <v-text-field label="Email" v-model="newEmployee.email"  required></v-text-field>
        <v-text-field label="Contact" v-model="newEmployee.phone_number" type="tel" required></v-text-field>
        <v-text-field label="Job Role" v-model="newEmployee.job_title" required></v-text-field>
        <v-text-field label="Salary" v-model="newEmployee.salary" type="number" required></v-text-field>
        <v-text-field label="Department Id" v-model="newEmployee.department_id" required></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn color="primary" type="submit">Register</v-btn>
        <v-btn color="error" @click="resetForm">Reset</v-btn>
      </v-card-actions>
    </v-card>
  </v-form>

  </v-container> 

  <!-- Dialog to show detailed information -->
  <v-dialog v-model="dialogVisible" max-width="500">
    <v-card>
      <v-card-title
        >{{ selectedEmployee.first_name }}
        {{ selectedEmployee.last_name }}</v-card-title
      >
      <v-card-text>
        <div>
          <strong>Employee ID:</strong> {{ selectedEmployee.employee_id }}
        </div>
        <div>
          <strong>Date of Birth:</strong> {{ selectedEmployee.date_of_birth }}
        </div>
        <div><strong>Email:</strong> {{ selectedEmployee.email }}</div>
        <div><strong>Address:</strong> {{ selectedEmployee.address }}</div>
        <div><strong>Contact:</strong> {{ selectedEmployee.phone_number }}</div>
        <div><strong>Job Role:</strong> {{ selectedEmployee.job_title }}</div>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" @click="dialogVisible = false">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Dialog to update employee information -->
  <v-dialog v-model="updateDialogVisible" max-width="500">
    <v-card>
      <v-card-title>Update Employee</v-card-title>
      <v-card-text>
        <div>
          <strong>Employee ID:</strong> {{ updatedEmployee.employee_id }}
        </div>
        <div>
          <strong>First Name:</strong>
          <v-text-field v-model="updatedEmployee.first_name" />
        </div>
        <div>
          <strong>Last Name:</strong>
          <v-text-field v-model="updatedEmployee.last_name" />
        </div>
        <div>
          <strong>Date Of Birth:</strong>
          <v-text-field type="date" v-model="updatedEmployee.date_of_birth" />
        </div>
        <div>
          <v-radio-group v-model="updatedEmployee.gender">
            <template v-slot:label>
              <div><strong>Gender</strong></div>
            </template>
            <v-radio value="Male">
              <template v-slot:label>
                <div><strong class="text-primary">Male</strong></div>
              </template>
            </v-radio>
            <v-radio value="Female">
              <template v-slot:label>
                <div><strong class="text-primary">Female</strong></div>
              </template>
            </v-radio>
          </v-radio-group>
        </div>
        <div>
          <strong>Salary:</strong>
          <v-text-field type="number" v-model="updatedEmployee.salary" />
        </div>
      </v-card-text>
      <v-card-actions>
        <v-btn variant="outlined" @click="updateDialogVisible = false"
          >Cancel</v-btn
        >
        <v-btn variant="outlined" @click="saveUpdatedEmployee">Save</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import axios from 'axios';
import _ from 'lodash';
import { ref, computed, onMounted } from 'vue';
const employees = ref([]);
const searchKeyword = ref('');
const searchId = ref('');
const dialogVisible = ref(false);
const selectedEmployee = ref({});
const filterOptions = ref(['Name','Emp ID', 'Gender', 'Salary', 'Department']);
const genderOptions = ref(['Male', 'Female']);
const salaryOptions = ref(['Lowest to Highest', 'Highest to Lowest']);
const departmentOptions = ref(['Sales', 'Marketing', 'Human Resources', 'Finance', 'Operations']);
const selectedFilter = ref('');
const selectedGender = ref('');
const selectedSalary = ref('');
const selectedDepartment = ref('');
const updateDialogVisible = ref(false);
const addEmployeeVisible = ref(false)
const updatedEmployee = ref({
  employee_id: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  salary: '',
  // Add other employee properties you want to update here
});

const newEmployee = ref({
  first_name: '',
  last_name: '',
  date_of_birth: '',
  gender: '',
  address: '',
  email: '',
  phone_number: '',
  job_title: '',
  salary: '',
  department_id: '',
});

const onMountedHandler = () => {
  axios
    .get('http://localhost:5000/api/employees')
    .then((response) => {
      employees.value = response.data;
    })
    .catch((error) => {
      console.error('Error fetching employee data:', error);
    });
};

const filteredEmployees = computed(() => {
  switch (selectedFilter.value) {
    case 'Gender':
      return filterByGender();
    case 'Salary':
      return filterBySalary();
    case 'Department':
      return filterByDepartment();
    default:
      return filterByKeyword();
  }
});

const employeesToShow = computed(() => {
  if (filteredEmployees.value.length > 0) {
    return filteredEmployees.value;
  } else {
    return employees.value;
  }
});

const showDetails = (employee) => {
  selectedEmployee.value = employee;
  dialogVisible.value = true;
};

const searchById = (searchId) => {
  for (const employee of employees.value) {
    if (employee.employee_id === searchId) {
      selectedEmployee.value = employee;
      dialogVisible.value = true;
      return;
    }
  }
  alert('Employee not found with the given ID.');
};

const filterByGender = () => {
  const filteredEmployees = [];
  if (selectedGender.value) {
    for (const employee of employees.value) {
      if (employee.gender.toLowerCase() === selectedGender.value.toLowerCase()) {
        filteredEmployees.push(employee);
      }
    }
  } else {
    return employees.value;
  }
  return filteredEmployees;
};

const filterBySalary = () => {
  if (selectedSalary.value === 'Lowest to Highest') {
    return _.orderBy(employees.value, ['salary'], ['asc']);
  } else if (selectedSalary.value === 'Highest to Lowest') {
    return _.orderBy(employees.value, ['salary'], ['desc']);
  }
  return employees.value;
};

const filterByDepartment = () => {
  const filteredEmployees = [];
  if (selectedDepartment.value) {
    for (const employee of employees.value) {
      if (employee.department_name.toLowerCase() === selectedDepartment.value.toLowerCase()) {
        filteredEmployees.push(employee);
      }
    }
  } else {
    return employees.value;
  }
  return filteredEmployees;
};

const filterByKeyword = () => {
  const keyword = searchKeyword.value.toLowerCase().trim();
  return _.filter(employees.value, (employee) => {
    return (
      employee.first_name.toLowerCase().includes(keyword) ||
      employee.last_name.toLowerCase().includes(keyword) ||
      employee.job_title.toLowerCase().includes(keyword)
    );
  });
};

const updateEmployee = (employee) => {
  updatedEmployee.value = {
    employee_id: employee.employee_id,
    first_name: employee.first_name,
    last_name: employee.last_name,
    date_of_birth: employee.date_of_birth,
    gender: employee.gender,
    salary: employee.salary,
  };
  updateDialogVisible.value = true;
};
 
const saveUpdatedEmployee = () => {
  axios
    .post(`http://localhost:5000/api/employees/${updatedEmployee.value.employee_id}`, updatedEmployee.value)
    .then((response) => {
      const updatedEmployeeIndex = employees.value.findIndex(
        (employee) => employee.employee_id === updatedEmployee.value.employee_id
      );
      if (updatedEmployeeIndex !== -1) {
        employees.value[updatedEmployeeIndex] = response.data;
        updateDialogVisible.value = false;
        console.log('Employee updated successfully');
      }
    })
    .catch((error) => {
      console.error('Error updating employee data:', error);
    });
};

const deleteEmployee = (employee) => {
  alert('You are deleting the employee with ID ' + employee.employee_id);

  axios
    .delete(`http://localhost:5000/api/employees/${employee.employee_id}`)
    .then((response) => {
      console.log(`Deleted post with ID ${employee.employee_id}`, response.data);
    })
    .catch((error) => {
      console.error(error);
    });
};
const resetForm = () => {
  newEmployee.value = ''
  
}
const addNewEmployee = () => {
  axios
    .post('http://localhost:5000/api/employees', newEmployee.value)
    .then((response) => {
      // Assuming the response contains the newly added employee
      employees.value.push(response.data);
      addEmployeeVisible.value = false;
      resetForm(); 
      console.log('New employee added successfully');
    })
    .catch((error) => {
      console.error('Error adding a new employee:', error);
    });
};
onMounted(onMountedHandler);
</script>


<style scoped>
h1 {
  text-align: center;
}

.search-bar {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: 20px;
  width: 100%;
}

.search-bar input {
  padding: 10px;
  width: 300px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.search-button {
  margin-left: 10px;
}
</style>
