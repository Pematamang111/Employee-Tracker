const express = require('express');
//require pool og pg to connect
const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    //PostgreSQL username and password
    user: 'postgres',
    password: '12345',
    host: 'localhost',
    database: 'employee_db'
  },
  console.log(`Connected to the books_db database.`)
)

pool.connect();

