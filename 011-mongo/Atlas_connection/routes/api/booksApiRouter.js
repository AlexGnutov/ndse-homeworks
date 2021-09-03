const express = require('express');
const router = express.Router();

//const fileMiddleWare = require('../../middleware/file.js');
const formData = require('express-form-data');
const randomBytes = require('random-bytes');//Random ID generation

//Call MongoDB Schema - Book
const Book = require('../../models/library.js');

//Get all books /* OK */
router.get('/', async (req, res) => {
    try {
        const data = await Book.find();   
        res.status(200).json(data);     
    } catch(e) {
        console.log(e.message)        
    }        
});

//Get a book by id /* OK */
router.get('/:id', async (req, res) => {
    const {id} = req.params;
    
    try {
        const aBook = await Book.findById(id);
        if (aBook) {
            res.status(200).json(aBook);
        } else {
            res.status(410).json(`The book with ID ${id} was deleted`);
        }
    } catch(e) {
        console.log(e.message);
        res.status(400).json(`A book with ID ${id} doesn't exist`);
    }        
});

//POST a book /* OK */
router.post('/', formData.parse(), async (req, res) => {
  
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    if (title && authors) {
        const exist = await Book.findOne({title: title}).exec();

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
                //console.error(e.message);
            };

            res.status(200).json(newBook);
        
        } else {
            res.status(400).json(`Can't create: a book named ${title} alredy exist.`);
        }
    } else {
        res.status(400).json(`Can't create: title and authors required`);
    }
});

//Change a book by id /* OK */
router.put('/:id', formData.parse(), async (req, res) => {
    
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
            res.status(200).json(updBook);
        } catch(e) {
            res.status(400).json(`Can't udate: a book ${id} not exist.`);
        }   
    } else {
        res.status(400).json(`Can't udate: nothing to update.`);
    }
});

//Delete a book by id /* OK */
router.delete('/:id', async (req, res) => {
    
    const {id} = req.params;
    const filter = {_id: id};

    try {
        const resp = await Book.deleteOne(filter);
        if (resp.deletedCount === 1) { 
            res.status(200).json(`The book with ID ${id} deleted.`);
        } else if (resp.deletedCount === 0) {
            res.status(410).json(`The book ID ${id} wasn't found.`);
        }
    } catch(e) {
        //console.log(e.message);
        res.status(400).json(`Can't delete: a book with ID ${id} doesn't exist`);
    }

});


module.exports = router;