const express = require("express")
const mysql = require("mysql2")
const cors = require('cors');
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');

const app = express()
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "employee_table"
})

connection.connect((err) => {
  if (err) {
    console.log("Error connection to database.")
    return;
  } else {
    console.log("Success connecting to database.")
  }

})

/app.post('/api/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  connection.query('SELECT * FROM registered_user WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Error checking for duplicate user:', error);
      return res.status(500).json({ error: 'Server error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    const saltRounds = 10;
    try {
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const newUser = { first_name: firstName, last_name: lastName, email, password: hashedPassword };

      connection.query('INSERT INTO registered_user SET ?', newUser, (insertError, insertResults) => {
        if (insertError) {
          return res.status(500).json({ error: 'Failed to register user' });
        }
        res.json({ message: 'User registered successfully' });
      });
    } catch (hashError) {
      res.status(500).json({ error: 'Failed to hash password' });
    }
  });
});


//for login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    connection.query('SELECT * FROM registered_user WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Server error' });
      } else if (results.length === 1) {
        const user = results[0];
        try {
          const passwordMatch = await bcrypt.compare(password, user.password);
          if (passwordMatch) {
            res.json({ success: true, message: 'Login successful' });
          } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
          }
        } catch (error) {
          console.error('Error comparing passwords:', error);
          res.status(500).json({ success: false, message: 'Server error' });
        }
      } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
      }
    });
  });
  
  

app.get("/api/employees", (req, res) => {
  const query = 'SELECT e.*, d.department_name ' +
    'FROM employees e ' +
    'JOIN departments d ON e.department_id = d.department_id';
  connection.query(query, (err, results) => {
    if (err) {
      console.error(err)
      return res.status(500).json({ error: "Error connecting employees" })
    }
    return res.json(results)
  })
})

// Update an employee record by employee ID
app.post('/api/employees/:employee_id', (req, res) => {
  const employee_id = req.params.employee_id;
  const updatedEmployee = req.body;

  connection.query('UPDATE employees SET ? WHERE employee_id = ?', [updatedEmployee, employee_id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to update employee data' });
    } else {
      res.json({ message: 'Employee updated successfully' });
    }
  });
});

// delete an employee by employee id
app.delete('/api/employees/:employee_id', (req, res) => {
  const employee_id = req.params.employee_id;
  connection.query('DELETE from employees WHERE employee_id = ?', [employee_id], (error, results) => {
    if (error) {
      res.status(500).json({ error: 'Failed to delete employee data' });
    } else {
      res.json({ message: 'Employee deleted successfully' });
    }
  });
});


// Route to add a new employee
app.post('/api/employees', (req, res) => {
  const newEmployee = req.body;
  connection.query('INSERT INTO employees SET ?', newEmployee, (error, results) => {
    if (error) {
      console.error('Error adding a new employee:', error);
      return res.status(500).json({ error: 'Failed to add a new employee' });
    }
    res.json({ message: 'Employee added successfully' });
  });
});

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT)
})