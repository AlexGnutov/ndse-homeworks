const randomBytes = require('random-bytes');//Random ID generation

class Book {
    constructor(title, description, authors, favorite) {
        this.id = randomBytes.sync(10).toString("hex");
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = '';
        this.fileName = '';
        this.fileBook = '';
    };  
}

module.exports = {Book};