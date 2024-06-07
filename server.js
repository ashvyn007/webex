
const connection= require('./conn')
const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyparser = require('body-parser')

require('dotenv').config();
const API_KEY=(process.env.API_KEY); // Access your API key


const app = express()
const port = 3000

app.get('/api/key', (req, res) => {
  res.json({ apiKey: process.env.API_KEY });
});


// app.use('/static', express.static(path.join(__dirname, 'public')))
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));


app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

app.get('/', (req, res) => {
    res.sendFile('index.html',{root:__dirname})
})


app.get('/admin',(req,res)=>{
    res.sendFile('views/admin.html',{root:__dirname})
})

app.get('/admin-login',(req,res)=>{
    res.sendFile('views/admin-login.html',{root:__dirname});    
})
app.get('/student',(req,res)=>{
    res.sendFile('views/student.html',{root:__dirname});
})
app.get('/student-login',(req,res)=>{
    res.sendFile('views/student-login.html',{root:__dirname});
})


app.post('/student-login', (req, res) => {
  const s_email = req.body.s_email;
  const s_password = req.body.s_pass;
  if (s_email && s_password) {
    connection.query('SELECT * FROM student WHERE student_email = ?', [s_email], (error, results, fields) => {
      if (results.length > 0) {
          console.log(results[0])
          if (s_password == results[0].student_pass) {
            req.session.loggedin = true;
            req.session.user = s_email;
            req.session.user_id=results[0].usn
            console.log(req.session.user +" im session name")
            console.log(req.session.user_id+" in login page")
            res.redirect('/student');
          } else {
            res.send('password doesnt match');
          } 
      } else {
        res.send('Incorrect Username and/or Password!');
      }
    });
  } else {
    res.send('Please enter Username and Password!');
  }
});




app.get('/driver-login',(req,res)=>{
    res.sendFile('views/driver-login.html',{root:__dirname});
})

app.get('/students',(req,res)=>{
    const query = 'SELECT * FROM student JOIN driver ON student.bus_id = driver.bus_id;';
    connection.query(query, (err, results) => {
        console.log(results)
        
        if (err) {
            console.log(err);
            res.status(500).send('Internal Server Error');
          } else {
            res.json(results)
        }
});
});


app.get('/student-user', (req, res) => {
  if (!req.session.loggedin) {
    return res.status(401).send('Please login to view this page!');
  }
  const query = 'SELECT * FROM student JOIN driver ON student.bus_id = driver.bus_id WHERE student_email = ?';
  connection.query(query, [req.session.user], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});


// app.get('/students', (req, res) => {
//     // if (!req.session.usn) {
//     //     return res.status(401).send('You are not logged in');
//     // }
// console.log("im students")
//     const usn = req.session.usn;

//     const query = 'SELECT * FROM student ';
//     connection.query(query, (err, results) => {
//         console.log(results)
//         if (err) {
//             console.error('Error executing query:', err.stack);
//             return res.status(500).send('Error retrieving data');
//         }

//         if (results.length > 0) {
//             res.json(results[0]);
//         } else {
//             res.status(404).send('Student not found');
//         }
//     });
// });

app.get('/driver',(req,res)=>{
    res.sendFile('views/driver.html',{root:__dirname})
})


app.listen(port, () => {
  console.log(`listerning on http://localhost:${port}`)
})