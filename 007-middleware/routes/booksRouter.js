const express = require('express');
const router = express.Router();

const fileMiddleWare = require('../middleware/file.js');
const formData = require('express-form-data');

//Define library array and three test books
const {Book} = require('./library.js'); //Book class call

const library = [];
[1, 2, 3].map(el => {
    const newBook = new Book('','','','');
    newBook.fileName = `${el + ".txt"}`;
    newBook.fileBook = `${el + ".txt"}`;
    library.push(newBook);
});

//Get complete books list
router.get('/', (req, res) => {
    res.json(library);
});

//Get a book by ID - no ID: return 404 + text
router.get('/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);

    if (index !== -1) {
        res.json(library[index]);
    } else {
        res.status(404);
        res.json(`Book ${id} is not found`);
    }
})

//Add a new book 
router.post('/', formData.parse(), (req, res) => {
    const {title, description, authors, favorite} = req.body;

    if (title && authors) {    
        const newBook = new Book(title, description, authors, favorite);
        library.push(newBook);
        res.status(201);
        res.json(newBook);
    } else {
        res.status(404);
        res.json(`Plese enter at least title and authors to add new book!`);
    }
});

//Upload book file (txt, pdf, doc) acc. to ID
router.post('/:id/upload', fileMiddleWare.single('book-file'), (req, res) => {
   
    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);

    if (index !== - 1)  {
        if (req.file) {
            const {path} = req.file;
            library[index].fileName = req.file.originalname;
            library[index].fileBook = req.file.filename;
            console.log(path);               
            res.status(201);
            res.json(`The file added successfully`);
        } else {
            res.status(404);
            res.json(`Wrong file format or upload error`);
        }
    } else {
        res.status(404);
        res.json(`A book with id: ${id} doesn't exist.`);
    }
});

//Update book data
router.put('/:id', formData.parse(), (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName} = req.body;
        
    let update = {title, description, authors, favorite, fileCover, fileName};

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
        res.json(library[index]);
    } else {
        res.status(404);
        res.json("The book wasn't found");
    }  
});

//Delete a book by ID
router.delete('/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);
    if (index !== -1) {
        library.splice(index, 1);
        res.json("ok");        
    } else {
        res.json("The book doesn't exist");
    }
});

router.get('/:id/download', (req, res) => {
    
    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);
    
    if (index === -1) {
        res.status(404);
        res.json(`Book with id ${id} is not found`);
    } else {
    
    const book = library[index];
    
    res.download(__dirname + '/../books/'+ book.fileBook, book.fileName, err => {
        if (err) {
            res.status(404);
            res.json('File not found');
        }
    });
    }        
});

module.exports = router;