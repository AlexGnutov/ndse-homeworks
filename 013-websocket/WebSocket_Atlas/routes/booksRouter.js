const express = require('express');
const router = express.Router();

//const fileMiddleWare = require('../middleware/file.js');
const formData = require('express-form-data');
const authCheck = require('../middleware/authenticate');

//Call MongoDB Schema - Book
const Book = require('../models/library.js');
const Message = require('../models/message.js');

//Get complete books list
router.get('/', async (req, res) => {
    try {
        const data = await Book.find();   
        res.render("books/index", {
            title: "Books list",
            library: data,
            user: req.user
        });    
    } catch(e) {
        console.log(e.message) 
        res.status(404).json(`Server or Database error`);       
    }
});

//Create book routes
router.get('/create', 
    authCheck,
    function (req, res) {
        res.render("books/create", {
            title: "Library | create",
            book: {},
            user: req.user,
        });
    }
);

router.post('/create', 
    authCheck,
    formData.parse(), 
    async (req, res) => {
        const {title, description, authors, favorite, fileCover, fileName} = req.body;
        
        if (title && authors) {
            const exist = await Book.findOne({title: title}).exec(); //Check, if the book exists

            if (exist === null) {
                const newBook = new Book({
                    title,
                    description,
                    authors,
                    favorite,
                    fileCover,
                    fileName,
                });    
                
                try {
                    await newBook.save();            
                } catch(e) {
                    console.error(e.message);
                };
                res.redirect('/books');

            } else {
                res.status(400).json(`Can't create: a book named ${title} alredy exist.`);
            }
        } else {
            res.status(400).json(`Can't create: title and authors required`);
        }
});

//Delete a book
router.post('/delete/:id', 
    authCheck,
    async (req, res) => {
        const {id} = req.params;
        const filter = {_id: id};

        try {
            const resp = await Book.deleteOne(filter);
            if (resp.deletedCount === 1) { 
                res.redirect('/books/');
            } else if (resp.deletedCount === 0) {
                res.status(410).json(`The book ID ${id} wasn't found.`);
            }
        } catch(e) {
            res.status(400).json(`Can't delete: a book with ID ${id} doesn't exist`);
        }
});

//View a book
router.get('/view/:id', async (req, res) => {
    const {id} = req.params;
    
    try {
        const aBook = await Book.findById(id);
        const messages = await Message.find({bookId: id}).sort({date: 'asc'}).exec();
        if (aBook) {
            res.render("books/view", {
                title: "Library | view",
                book: aBook,
                user: req.user,
                messages: messages,
            });
        } else {
            res.status(410).json(`The book with ID ${id} was deleted`);
        }
    } catch(e) {
        console.log(e.message);
        res.status(400).json(`A book with ID ${id} doesn't exist`);
    }   
});

//Update a book
router.get('/update/:id', 
    authCheck,
    async (req, res) => {
        const {id} = req.params;
        
        try {
            const aBook = await Book.findById(id);
            if (aBook) {
                res.render("books/update", {
                    title: "Library | view",
                    book: aBook,
                    user: req.user
                })
            } else {
                res.status(410).json(`The book with ID ${id} was deleted`);
            }
        } catch(e) {
            console.log(e.message);
            res.status(400).json(`A book with ID ${id} doesn't exist`);
        }     
});

router.post('/update/:id', 
    authCheck,
    formData.parse(), 
    async (req, res) => {
   
        const {id} = req.params;
        const {title, description, authors, favorite, fileCover, fileName} = req.body;

        let update = {title, description, authors, favorite, fileCover, fileName};

        for (let key in update) {
            if (!update[key]) {
                delete update[key];
            }
        }  
        if (Object.values(update).length) {
            try {
                const updBook = await Book.findByIdAndUpdate(id, update, {new: true});
                res.redirect(`/books/view/${id}`);
            } catch(e) {
                res.status(400).json(`Can't udate: a book ${id} not exist.`);
            }   
        } else {
            res.status(400).json(`Can't udate: nothing to update.`);
        }       
});

module.exports = router;

