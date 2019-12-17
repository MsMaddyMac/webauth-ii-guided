const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const sessions = require('express-session'); // <<<<<< install express-session Global Middleware
const KnexSessionStore = require('connect-session-knex')(sessions); // to store sessions in database. This is curating, we are passing sessions from line 4 into this KnexSessionStore function.

const authRouter = require('../auth/auth-router.js');
const usersRouter = require('../users/users-router.js');
const knex = require('../database/dbConfig'); // to reference the db in store below on line 24

const server = express();

// configure session & cookie storage
const sessionConfiguration = {
	// session storage options
	name: 'whatchamacallit', // default would be sid (session id)
	secret: 'pinky promise, please!', // used for encryption (must be an environment variable)
	resave: false,
	saveUninitialized: true, // has implications with GDPR laws

	// how to store the sessions
	store: new KnexSessionStore({
		// DO NOT FORGET the new keyword
		knex, // imported from dbConfig.js
		createtable: true,

		// optional
		tablename: 'sessions', // optional default is 'sessions' can name the column whatever
		sidfieldname: 'sid',
		clearInterval: 1000 * 60 * 10
	}),

	// cookie option
	cookie: {
		maxAge: 1000 * 60 * 10, // session will be good for 10 mins
		secure: false, // if false the cookie is sent over http (development), if true only sent over https(production)
		httpOnly: true // if true JS (JavaScript) cannot access the cookie
	}
};

server.use(helmet());
server.use(express.json());
server.use(cors());
server.use(sessions(sessionConfiguration)); // adds a req.session object

server.use('/api/auth', authRouter);
server.use('/api/users', usersRouter);

server.get('/', (req, res) => {
	res.json({ api: 'up' });
});

module.exports = server;
