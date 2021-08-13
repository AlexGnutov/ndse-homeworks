const express = require("express");
const cors = require('cors');//?

const {PORT} = require('./config.js'); //Config varibles

const booksRouter = require('./routes/booksRouter.js');
const userRouter = require('./routes/userRouter.js');

//Get express object
const app = express();

app.use(cors());//Add cors module


app.use('/api/books', booksRouter);//Add books router
app.use('/api/user', userRouter);//Add user router

//Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});