const express = require("express");
const formData = require('express-form-data');
const http = require('http');
const socketIO = require('socket.io');

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
const {passport} = require('./middleware/passport.js');

//*** EXPRESS in SocketIO configuration***//
const app = express();              //Get and init express object
const server = http.Server(app);    //Get server 
const io = socketIO(server);        //Init socket IO

app.set("view engine", "ejs");      //Turn on EJS

const {sessionMiddleware, session} = require('./middleware/session');
app.use(sessionMiddleware);

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

//*** SOCKET IO ***/
const {comment} = require('./io/ioHandlers')(io);
const wrap = middleware => (socket, next) => middleware(socket.request, {}, next);

io.use(wrap(sessionMiddleware));
io.use(wrap(passport.initialize()));
io.use(wrap(passport.session()));

const onConnection = (socket) => {
    socket.on('comment', comment)
};

io.on('connection', onConnection);

///*** SERVER start and DB connection***/
const PORT = process.env.PORT || 3000;
const UrlDB = process.env.DB_HOST;

async function start() { //Async connect function to MongoDB Atlas
    try {
        await mongoose.connect(UrlDB);
        // app.listen(PORT, () => { //Start server after MongoDB Atlas connection
        //     console.log(`Server is running on port ${PORT}`);
        // })
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });

    } catch (e) {
        console.log(e);
    }
}

start(); //Start application
