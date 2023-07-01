'use strict';

const PORT = 3000;

// Passport-related imports
const passport = require('passport');
const LocalStrategy = require('passport-local');
const session = require('express-session');

const userDao = require('./dao/userDAO');
const seatsDao = require('./dao/seatsDAO');
const planesDao = require('./dao/planesDAO');
const reservationsDao = require('./dao/reservationsDAO');

const app = express();
app.use(morgan('common'));
app.use(express.json());

const PREFIX = '/api';


// set up and enable cors
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,
};
app.use(cors(corsOptions));

  
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

app.get('/api/planes', 
  (req, res) => {
    planesDao.getAllPlanes(req.query.filter)
      .then(planes => res.json(planes))
      .catch((err) => res.status(500).json(err)); // always return a json and an error message
  }
);

app.get('/api/planes/:id',
  [ check('id').isInt({min: 1}) ],
  async (req, res) => {
    try {
      const result = await planesDao.getPlanesByIds(req.params.id);
      if (result.error)
        res.status(404).json(result);
      else
        res.json(result);
    } catch (err) {
      res.status(500).end();
    }
  }
);

// RUN SERVER
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});

module.exports = app;