const express = require('express');
const router = express.Router();

const formData = require('express-form-data');
const User = require('../../models/users');

const {passport} = require('../../passport/index');


router.get('/login', 
    function (req, res) {
        res.render('user/login', {user: req.user});
    }
);
router.post('/login', formData.parse(),
    passport.authenticate(
        'local',
        {
            failureRedirect: '/login',
        },
    ),
    function (req, res) {
        console.log("User logged in: ", req.user)
        res.redirect('/')
    } 
);

router.get('/logout',
  function (req, res) {
    req.logout()
    res.redirect('/')
  });

router.get('/me', 
    function (req, res, next) {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
          if (req.session) {
            req.session.returnTo = req.originalUrl || req.url
          }
          return res.redirect('/')
        }
        next();
    },
    function (req, res) {
        res.render('user/profile', {user: req.user})
    }
);

router.post('/signup', 
    formData.parse(), 
    async (req, res) => {
        const {username, password, information} = req.body;
        const exist = await User.findOne({username: username}); // Check if username already used

        if (exist === null) { // Create new user //
            const newUser = new User ({
                username: username,
                password: password,
                information: information
            });
            try {
                await newUser.save(); // Add new user to the database //            
            } catch(e) {
                console.error(e.message);
                res.status(410).json(e.message);
            };
            res.redirect('/');            
        } else {
            res.json(`The USERNAME is already used - try another one`);
        }   
});

module.exports = router;