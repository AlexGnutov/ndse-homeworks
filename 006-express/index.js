const express = require("express");
const cors = require('cors');//?
const formData = require("express-form-data");//?

const {PORT} = require('./config.js'); //Config varibles
const {Book} = require('./library.js'); //Book class description

//Define library array and three test books
const library = [];
[1, 2, 3].map(el => {
    const newBook = new Book('','','','','','');
    library.push(newBook);
});

//Get express object
const app = express();

app.use(formData.parse());//Add req body parser
app.use(cors());//Add cors module (unnecessary)

//GET//
//Get complete list of books
app.get('/api/books', (req, res) => {
    res.json(library);
});

//Get a book by ID - no ID: return 404 + text
app.get('/api/books/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);

    if (index !== -1) {
        res.json(library[index]);
    } else {
        res.status(404);
        res.json(`Book ${id} is not found`);
    }
})

//POST//
//User login template
app.post('/api/user/login', (req, res) => {
    res.status(201);
    res.json({id: 1, mail: "test@mail.ru"});
});

//Add a new book
app.post('/api/books', (req, res) => {
    const {title, description, authors, favorite, fileCover, fileName} = req.body;

    if (title && authors) {    
        const newBook = new Book(title, description, authors, favorite, fileCover, fileName);
        library.push(newBook);
        res.status(201);
        res.json(newBook);
    } else {
        res.status(404);
        res.json(`Plese enter at least title and description to add new book!`);
    }
});

//PUT
//Update existing book data
app.put('/api/books/:id', (req, res) => {
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

//DELETE
//Delete a book by ID
app.delete('/api/books/:id', (req, res) => {
    const {id} = req.params;
    const index = library.findIndex(elem => elem.id === id);
    if (index !== -1) {
        library.splice(index, 1);
        res.json("ok");        
    } else {
        res.json("The book doesn't exist");
    }
}); 

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});