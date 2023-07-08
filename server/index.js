'use strict';

const PORT = 3000;


// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');


// Express-related imports
const session = require('express-session');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');


// Express validator
const { check, validationResult } = require('express-validator');


// DAO imports
const userDao = require('./userDAO');
const planesDao = require('./planesDAO');
const reservationDao = require('./reservationDAO');


// Create the server
const app = express();
app.use(morgan('dev'));
app.use(express.json());

const PREFIX = '/api';


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
  optionSuccessStatus:200
};
app.use(cors(corsOptions));


// Error formatter for express-validator
const errorFormatter = ({ location, msg, param, value, nestedErrors }) => {
  return `${location}[${param}]: ${msg}`;
};

// Passport: set up local strategy
passport.use(new LocalStrategy(async function verify(username, password, cb) {
    const user = await userDao.getUser(username, password)
    if(!user)
        return cb(null, false, 'Incorrect username or password.');
        
    return cb(null, user);
}));

passport.serializeUser(function (user, cb) {
    cb(null, user);
});
  
passport.deserializeUser(function (user, cb) { // this user is id + email + name
    return cb(null, user);
});
  
const isLoggedIn = (req, res, next) => {
    if(req.isAuthenticated()) {
        return next();
    }
    return res.status(401).json({error: 'Not authorized'});
}
  
app.use(session({
    secret: "Can you keep a little secret?",
    resave: false,
    saveUninitialized: false,
}));
app.use(passport.authenticate('session'));

//POST /api/sessions
// login

app.post('/api/sessions', function(req, res, next) {
  passport.authenticate('local', (err, user, info) => {
    if (err)
        return next(err);
    if (!user) {
        return res.status(401).send(info);
    }
    req.login(user, (err) => {
        if (err)
        return next(err);
        
        return res.status(201).json(req.user);
    });
  })(req, res, next);
});
  
// GET /api/sessions/current
// check whether the user is logged in or not

app.get(PREFIX+'/sessions/current', (req, res) => {
    if(req.isAuthenticated()) {
        res.json(req.user);
    }
    else
        res.status(401).json({error: 'Not authenticated'});
});
  
// DELETE /api/session/currents

app.delete(PREFIX+'/sessions/current', (req, res) => {
    req.logout(() => {
        res.end();
    });
});

/***** PLANES APIS ******/
// GET /api/planes/:id
// get plane by id

app.get('/api/planes/:id',
  [ check('id').isInt({min: 0}) ],
  async (req, res) => {
    try {
      const result = await planesDao.getPlanesById(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// GET /api/planes/:id/seats
// get occupied seats on the id plance

app.get('/api/planes/:id/seats',
  [ check('id').isInt({min: 1}) ],
  async (req, res) => {
    try {
      const result = await planesDao.getOccupiedSeats(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// GET /api/planes/
// get all planes

app.get('/api/planes/',
  async (req, res) => {
    try {
      const result = await planesDao.getAllPlanes();
      if (result.error) {
        res.status(404).json(result);
       } else {
        res.json(result);
       }
    } catch (err) {
      res.status(500).end();
    }
  }
);

/***** RESERVATIONS APIS ******/
// POST /api/reservations/
// create a new reservation

app.get('/api/reservations/:id',
  [ check('id').isInt({min: 0}) ],
  async (req, res) => {
    try {
      const result = await reservationDao.getReservationById(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);


// GET /api/reservations/user/:id
// get all reservations of a user

app.get('/api/reservations/user/:id',
  [ check('id').isInt({min: 0}) ],
  async (req, res) => {
    try {
      const result = await reservationDao.getReservationByUser(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// POST /api/reservations/
// create a new reservation

app.post('/api/reservations/',
  isLoggedIn,
  [
    check('plane_id').isInt({min: 0}),
  ],
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const reservation = {
      "plane_id": req.body.plane_id,
      "seats": req.body.seats,
      "user_id": req.user.id   
    };

    try {
      const check = await reservationDao.seatCheck(reservation.seats, reservation.plane_id);
      if (check.length>0)
        return res.status(422).json({ occupied: check, error: "Some seats are not available"});
    } catch (err) {
      res.status(503).json({ error: `Database error during the addition of the reservation: ${err}` });
    }

    try {
      const result = await reservationDao.addReservation(reservation); // NOTE: createFilm returns the new created object
      res.json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the addition of the reservation: ${err}` }); 
    }
  }
);

// DELETE /api/reservations/<id>
// Given a reservation id, this route deletes the associated reserevation from the database.

app.delete('/api/reservations/:id',
  isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
      // NOTE: if there is no film with the specified id, the delete operation is considered successful.
      const result = await reservationDao.deleteReservation(req.params.id);
      if (result == 200)
        return res.status(200).json({}); 
      else
        return res.status(404).json(result);
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of the reservations ${req.params.id}: ${err} ` });
    }
  }
);

// RUN SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

module.exports = app;