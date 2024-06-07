
const conn = require('./conn')
const express = require('express')
const path = require('path')
const session=require('express-session')


const app = express()
const port = 3000

app.use('/static', express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
    res.sendFile('index.html',{root:__dirname})
})

app.get('/student',(req,res)=>{
    res.sendFile('views/student.html',{root:__dirname});

    
})

app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

app.get('/students', (req, res) => {
    // if (!req.session.usn) {
    //     return res.status(401).send('You are not logged in');
    // }

    const usn = req.session.usn;

    const query = 'SELECT * FROM student ';
    conn.query(query, (err, results) => {
        if (err) {
            console.error('Error executing query:', err.stack);
            return res.status(500).send('Error retrieving data');
        }

        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Student not found');
        }
    });
});

app.get('/admin',(req,res)=>{
    res.sendFile('views/admin.html',{root:__dirname})
})
app.get('/driver',(req,res)=>{
    res.sendFile('views/driver.html',{root:__dirname})
})


app.listen(port, () => {
  console.log(`listerning on http://localhost:${port}`)
})