const randomBytes = require('random-bytes');//Random ID generation

class Book {
    constructor(title, description, authors, favorite, fileCover, fileName) {
        this.id = randomBytes.sync(10).toString("hex");
        this.title = title;
        this.description = description;
        this.authors = authors;
        this.favorite = favorite;
        this.fileCover = fileCover;
        this.fileName = fileName;
    };  
}

module.exports = {Book};