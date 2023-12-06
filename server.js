'use strict';
const express = require('express');
const mongoose = require('mongoose');
const MongoClient = require('mongodb').MongoClient;
const moment = require('moment');
const bodyParser = require('body-parser');
const path = require('path');
const dotenv = require('dotenv'); //dotenv package for environment variables
const rateLimit = require('express-rate-limit'); //rate limiting package
const helmet = require('helmet'); //helmet for security headers
const app = express();
const cors = require('cors');
// const ObjectId = require('mongodb').ObjectId
// const fetch = require('node-fetch');

const port = process.env.PORT || 3000; 

// Connection URL
const url = 'mongodb+srv://albertzkie:Ewankonga123@pvhosms.jghekic.mongodb.net/'; 
const dbName = 'pvhosms_db'; 

// Enable CORS middleware
app.use(cors());
dotenv.config();
// Middleware to parse incoming form data
app.use(express.urlencoded({ extended: true }));
// Add middleware to parse JSON
app.use(express.json());
// Serve static files from the 'public' directory
app.use(express.static('public'));
app.use(bodyParser.json());

//----------------express.js-----------------//
// Serve HTML files from the 'views' directory
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'login.html');
    res.sendFile(filePath);
  });
  app.get('/loader.html', (req, res, next) => {
    setTimeout(() => {
      res.redirect('/index.html');
    }, 5000); // 5000 milliseconds (5 seconds)
  });
  
  // Serve other HTML files
  const htmlFiles = ['qrgen'];
  htmlFiles.forEach((file) => {
    app.get(`/${file}.html`, (req, res) => {
      const filePath = path.join(__dirname, `${file}.html`);
      res.sendFile(filePath);
    });
  });
  //----------------express.js-----------------//
  
  // Connect to MongoDB
  mongoose.connect(url + dbName, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });


  
//------------------login form--------------------//
app.use(bodyParser.json());
app.use(express.json());

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const result = await authenticateUser(username, password);
    if (result.success) {
      console.log('Login successful');
      res.send('Login successful');
    } else {
      console.log('Invalid username or password');
      res.send('Invalid username or password');
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

async function authenticateUser(username, password) {
  const client = new MongoClient("mongodb+srv://albertzkie:Ewankonga123@pvhosms.jghekic.mongodb.net/?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  try {
    await client.connect();
    const database = client.db("pvhosms_db");
    const collection = database.collection("residence");
    const filter = {
      username: username,
      password: password,
    };
    const user = await collection.findOne(filter);
    if (user) {
      return { success: true };
    } else {
      return { success: false };
    }
  } finally {
    await client.close();
  }
}
//-----------------------login-------------------//

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
  });
  
  app.use(limiter);
  
  // Helmet middleware for security headers
  app.use(helmet());
  
  // Error handling middleware
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
  });
  
  // Start the server
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
  
  