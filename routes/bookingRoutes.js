const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const multer = require('multer');

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'photo_studio_db'
});

const Photos = require("../models/Photos");

const storage = multer.diskStorage({
  destination: './public/uploads/',
  filename: (req, file, cb) => {
      cb(null, file.originalname);
  }
});

// View all bookings (Read)
// router.get('/', (req, res) => {
//   let sql = 'SELECT * FROM bookings';
//   db.query(sql, (err, results) => {
//     if (err) throw err;
//     res.render('index', { bookings: results });
//   });
// });

// Show form to create new booking (Create)
router.get('/', (req, res) => {
  const photo = Photos.findAll();
  res.render('form', {photo});
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
      const filetypes = /jpeg|jpg|png|gif/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

      if (mimetype && extname) {
          return cb(null, true);
      }
      cb('Error: File upload only supports the following filetypes - ' + filetypes);
  }
});

// Insert new booking into database
router.post('/', (req, res) => {
  const { name, email, phone, date, service, comments } = req.body;
  let sql = 'INSERT INTO bookings SET ?';
  let newBooking = { name, email, phone, date, service, comments };
  db.query(sql, newBooking, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Show form to edit a booking (Update)
router.get('/edit/:id', (req, res) => {
  let sql = `SELECT * FROM bookings WHERE id = ${req.params.id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render('edit', { booking: result[0] });
  });
});

// Update booking in database
router.post('/edit/:id', (req, res) => {
  const { name, email, phone, date, service, comments } = req.body;
  let sql = `UPDATE bookings SET name = '${name}', email = '${email}', phone = '${phone}', date = '${date}', service = '${service}', comments = '${comments}' WHERE id = ${req.params.id}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

// Delete a booking (Delete)
router.get('/delete/:id', (req, res) => {
  let sql = `DELETE FROM bookings WHERE id = ${req.params.id}`;
  db.query(sql, (err) => {
    if (err) throw err;
    res.redirect('/');
  });
});

module.exports = router;
