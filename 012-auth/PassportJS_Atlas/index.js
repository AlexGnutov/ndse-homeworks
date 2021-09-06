const express = require("express");
const formData = require('express-form-data');

const mongoose = require('mongoose'); // Init mongoose for MongoDB operations
mongoose.set('useNewUrlParser', true); //Adding these according to Mongoose documentation recommendations
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//*** ROUTERS ***//
const errorMiddleware = require('./middleware/error'); //Call Error Middleware
const indexRouter = require('./routes/indexRouter.js'); //Call EJS routers
const booksRouter = require('./routes/booksRouter.js'); 
const booksApiRouter = require('./routes/api/booksApiRouter.js'); //Call API routers
const userApiRouter = require('./routes/api/userApiRouter.js');

//*** PASSPORT ***//
const {passport} = require('./passport/index.js');

//*
const app = express();              //Get and init express object
app.set("view engine", "ejs");      //Turn on EJS

app.use(require('express-session')({ //Add session module
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
}));

//Passport initialization
app.use(passport.initialize()); 
app.use(passport.session());

//Stadart routes 
app.use('/', indexRouter);
app.use('/books', booksRouter);
//API routes
app.use('/api/books', booksApiRouter);//Add books router
app.use('/api/user', userApiRouter);//Add user router

app.use(errorMiddleware); //No reply processing

const PORT = process.env.PORT || 3000;
const UrlDB = process.env.DB_HOST;

async function start() { //Async connect function to MongoDB Atlas
    try {
        await mongoose.connect(UrlDB);
        app.listen(PORT, () => { //Start server after MongoDB Atlas connection
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start(); //Start application
