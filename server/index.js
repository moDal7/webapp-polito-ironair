'use strict';

const PORT = 3000;

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { check, validationResult } = require('express-validator');

const userDao = require('./userDAO');
const planesDao = require('./planesDAO');
const reservationDao = require('./reservationDAO');

const app = express();
app.use(morgan('common'));
app.use(express.json());

const PREFIX = '/api';


/** Set up and enable Cross-Origin Resource Sharing (CORS) **/
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));


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
    secret: "shhhhh... it's a secret!",
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

// GET /api/planes/
// get all planes

app.get('/api/planes/',
  async (req, res) => {
    try {
      const result = await planesDao.getAllPlanes();
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
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

app.post('/api/reservations/',
  /*isLoggedIn,
  [
    check('plane').isInt({min: 0}),
    check('seats').isLength({min: 2}),
  ],*/
  async (req, res) => {
    // Is there any validation error?
    const errors = validationResult(req).formatWith(errorFormatter); // format error message
    if (!errors.isEmpty()) {
      return res.status(422).json({ error: errors.array().join(", ") }); // error message is a single string with all error joined together
    }

    const reservation = {
      plane: req.body.plane,
      seats: req.body.seats,
      user: req.body.user  // user is overwritten with the id of the user that is doing the request and it is logged in
    };

    try {
      const result = await reservationDao.addReservation(reservation); // NOTE: createFilm returns the new created object
      console.log(result)
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
      const result = await reservationDao.deleteReservation(req.user.id, req.params.id);
      if (result == null)
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