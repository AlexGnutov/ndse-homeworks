const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.render("index", {
        title: 'Welcome to our Library',
        user: req.user 
    })
});

module.exports = router;

