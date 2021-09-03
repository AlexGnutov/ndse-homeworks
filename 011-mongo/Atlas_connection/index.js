const express = require("express");
const cors = require('cors');

const mongoose = require('mongoose');
mongoose.set('useNewUrlParser', true); //According to Mongoose documentation recommendations
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);

//Call Error Middleware
const errorMiddleware = require('./middleware/error');
//Call EJS routers
const indexRouter = require('./routes/indexRouter.js');
//const booksRouter = require('./routes/booksRouter.js'); - blocked - lib class needs UPDATE
//Call API routers (parallel)
const booksApiRouter = require('./routes/api/booksApiRouter.js');
const userApiRouter = require('./routes/api/userApiRouter.js');

const app = express();              //Get and init express object
app.use(cors());                    //Add cors module
app.set("view engine", "ejs");      //Turn on EJS

//Attach EJS based routes 
app.use('/', indexRouter);
//app.use('/books', booksRouter);

//Attach API routes (parallel)
app.use('/api/books', booksApiRouter);//Add books router
app.use('/api/user', userApiRouter);//Add user router

//No reply processing
app.use(errorMiddleware);

const PORT = process.env.PORT || 3000;
const UrlDB = process.env.DB_HOST;

//Async connect function to MongoDB Atlas
async function start() {
    try {
        await mongoose.connect(UrlDB);
        
        //Start server after MongoDB Atlas connection
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        })
    } catch (e) {
        console.log(e);
    }
}

start(); //Start application
