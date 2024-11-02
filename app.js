const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const multer = require('multer');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();

// add booking route
const bookingRoutes = require('./routes/bookingRoutes');

const photoDB = require("./helpers/db");
const Users = require("./models/Users");
const Photos = require("./models/Photos");
const Bookings = require("./models/Bookings");

// Set up MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'photo_studio_db'
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL Database.');
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// Session middleware
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Set view engine
app.set('view engine', 'ejs');

// Multer for file uploads
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

// Check if user is logged in
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) {
        return next();
    }
    res.redirect('/login');
};


app.use('/book', bookingRoutes);

// Routes
app.get('/', isAuthenticated, async (req, res) => {
    // db.query('SELECT * FROM photos', (err, results) => {
    //     if (err) throw err;
    //     res.render('index', { photos: results });
    // });
    const photos = await Photos.findAll();
    const bookings = await Bookings.findAll();
    res.render('index', { bookings: bookings, photo: photos });
});

// User registration route
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', async (req, res) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
            return res.status(400).send('Username already exists');
        }
        res.redirect('/login');
    });
});

// User login route
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.query('SELECT * FROM users WHERE username = ?', [username], async (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).send('Invalid username or password');
        }
        const user = results[0];
        const match = await bcrypt.compare(password, user.password);
        if (match) {
            req.session.userId = user.id;
            res.redirect('/');
        } else {
            res.status(400).send('Invalid username or password');
        }
    });
});

// Logout route
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/login');
    });
});

// Insert a photo
app.post('/add', upload.single('image'), (req, res) => {
    const { title, description } = req.body;
    const image_url = req.file.filename;
    db.query('INSERT INTO photos (title, description, image_url) VALUES (?, ?, ?)', 
             [title, description, image_url], 
             (err) => {
                if (err) throw err;
                res.redirect('/');
             });
});

// Edit a photo
app.get('/edit/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('SELECT * FROM photos WHERE id = ?', [id], (err, result) => {
        if (err) throw err;
        res.render('edit', { photo: result[0] });
    });
});

app.post('/update/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    db.query('UPDATE photos SET title = ?, description = ? WHERE id = ?', 
             [title, description, id], 
             (err) => {
                if (err) throw err;
                res.redirect('/');
             });
});

// Delete a photo
app.get('/delete/:id', isAuthenticated, (req, res) => {
    const id = req.params.id;
    db.query('DELETE FROM photos WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.redirect('/');
    });
});

photoDB.sync();

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// start application and listen on port 5000
app.listen(3000,() => {
    console.log("Application running on port: ", 3000)
}
);