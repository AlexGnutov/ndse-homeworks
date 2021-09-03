const express = require('express');
const router = express.Router();

//const fileMiddleWare = require('../middleware/file.js');
const formData = require('express-form-data');

//Define library array and three test books
const Book = require('../models/library.js'); //Book class call

const library = [];

[1, 2, 3].map(el => {
    const newBook = new Book(
        'Book title',
        'Book description',
        'Book authors',
        'Favorites');
    newBook.fileName = `${el + ".txt"}`;
    newBook.fileBook = `${el + ".txt"}`;
    library.push(newBook);
});

//Get complete books list
router.get('/', (req, res) => {
    res.render("books/index", {
        title: "Books list",
        library: library
    });    
});

//Create book routes
router.get('/create', (req, res) => {
    res.render("books/create", {
        title: "Library | create",
        book: {}
    });
});

router.post('/create', formData.parse(), (req, res) => {
    const {title, authors, description} = req.body;
    const newBook = new Book(title, authors, description, '');
    library.push(newBook);

    res.redirect('/books');
});

//Delete a book
router.post('/delete/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(el => el.id === id);

    if (index !== -1) {
        library.splice(index, 1);
        res.redirect(`/books`);
    } else {
        res.status(404).redirect('/404');
    }
});

//View a book
router.get('/view/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(el => el.id === id);
   
    if (index !== -1) {
        res.render("books/view", {
            title: "Library | view",
            book: library[index],
        });
    } else {
        res.status(404).redirect('/404');
    }
});

//Update a book
router.get('/update/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(el => el.id === id);

    if (index !== -1) {
        res.render("books/update", {
            title: "Library | view",
            book: library[index],
        });
    } else {
        res.status(404).redirect('/404');
    }
});

router.post('/update/:id', formData.parse(), (req, res) => {
    const {title, description, authors} = req.body;
    let update = {title, description, authors};

    Object.keys(update).forEach(key => {
        if (update[key] === undefined) {
            delete update[key];
        }
    });

    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);

    if (index !== -1) {
        library[index] = {
            ...library[index],
            ...update
        };
        res.redirect(`/books/view/${library[index].id}`);
    } else {
        res.status(404).redirect('/404');
    }  
});

module.exports = router;

