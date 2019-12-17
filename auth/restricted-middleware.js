module.exports = function(req, res, next) {
	if (req.session && req.session.user) {
		// This is defensive coding, if I have a session and a session user go to the next function
		next();
	} else {
		res.status(401).json({ message: 'You shall not pass!!' });
	}
};

// checks to see if you are logged in or not before allowing you to move on
