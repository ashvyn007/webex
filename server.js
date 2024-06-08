
const connection= require('./conn')
const express = require('express')
const path = require('path')
const session = require('express-session')
const bodyparser = require('body-parser')

require('dotenv').config();
const API_KEY=(process.env.API_KEY); // Access your API key


const app = express()
const port = 4000

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

app.post('/admin-login', (req, res) => {
  const a_email = 'admin2webex.com'
  const a_password = 'admin@1234';
  if (a_email && a_password) {
          if (a_password == 'admin@1234') {
            req.session.loggedin = true;
            req.session.user = a_email;
            console.log(req.session.user +" im session name")
            console.log(req.session.user_usn+" in login page")
            res.redirect('/admin');
          } else {
            res.send('password doesnt match');
          } 
      } else {
        res.send('Incorrect Username and/or Password!');
      }
    });
  

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
            req.session.user_usn=results[0].usn
            console.log(req.session.user +" im session name")
            console.log(req.session.user_usn+" in login page")
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


app.post('/driver-login', (req, res) => {
  const d_email = req.body.d_email;
  const d_password = req.body.d_pass;
  if (d_email && d_password) {
    connection.query('SELECT * FROM driver WHERE driver_email = ?', [d_email], (error, results, fields) => {
      if (results.length > 0) {
          console.log(results[0])
          if (d_password == results[0].driver_pass) {
            req.session.loggedin = true;
            req.session.user = d_email;
            req.session.user_id=results[0].bus_id
            console.log(req.session.user +" im session name")
            console.log(req.session.user_id+" in login page")
            res.redirect('/driver');
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
      // console.log(results)
      res.json(results);
    }
  });
});


app.get('/driver-user', (req, res) => {
  if (!req.session.loggedin) {
    return res.status(401).send('Please login to view this page!');
  }
  const query = 'SELECT * FROM student JOIN driver ON student.bus_id = driver.bus_id WHERE student.bus_id = ?';
  connection.query(query, [req.session.user_id], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.json(results);
    }
  });
});



app.get('/driver',(req,res)=>{
    res.sendFile('views/driver.html',{root:__dirname})
})


app.listen(port, () => {
  console.log(`listerning on http://localhost:${port}`)
})