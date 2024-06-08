
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
app.get('/student-form',(req,res)=>{
  res.sendFile('views/student-form.html',{root:__dirname});
})
app.get('/driver-form',(req,res)=>{
  res.sendFile('views/driver-form.html',{root:__dirname});
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



app.post("/student-form", (req, res) => {
  const usn = req.body.usn;
  const name = req.body.student_name;
  const email = req.body.student_email;
  const pass = req.body.student_pass;
  const c_pass=req.body.student_cpass;
  const lat = req.body.student_lat;
  const long = req.body.student_long;
  const place = req.body.student_place;
  const bus_id=req.body.bus_id;

  if (pass === c_pass) {
          var sql1 ="INSERT INTO `student` (`usn`, `student_name`, `student_email`, `student_pass`, `student_lat`, `student_long`, `student_place`, `bus_id`) VALUES (?,?,?,?,?,?,?,?);"
              connection.query(sql1,
                  [usn, name, email, c_pass, lat,long,place,bus_id],
                  (err, result) => {
                      if (err) {
                          console.error('Error inserting user:', err.message);
                          res.status(500).send('Error inserting user');
                      } else {
                          console.log("Value inserted successfully");
                          res.redirect('/admin');
                      }
                  }
              );
  } else {
      res.status(400).send('Passwords do not match');
  }
});


app.post("/driver-form", (req, res) => {
  const id = req.body.bus_id;
  const name = req.body.driver_name;
  const email = req.body.driver_email;
  const pass = req.body.driver_pass;
  const c_pass=req.body.driver_cpass;
  const lat = req.body.driver_lat;
  const long = req.body.driver_long;

  if (pass === c_pass) {
          var sql2 ="INSERT INTO `driver` (`bus_id`, `driver_name`, `driver_email`, `driver_pass`, `driver_lat`,`driver_long`)VALUES (?,?,?,?,?,?);"
              connection.query(sql2,
                  [id, name, email, c_pass, lat,long],
                  (err, result) => {
                      if (err) {
                          console.error('Error inserting user:', err.message);
                          res.status(500).send('Error inserting user');
                      } else {
                          console.log("Value inserted successfully");
                          res.redirect('/admin');
                      }
                  }
              );
  } else {
      res.status(400).send('Passwords do not match');
  }
});

app.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    } else {
      res.redirect('/');
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