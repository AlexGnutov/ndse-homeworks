

//запрос для вставки
db.books.insertMany([
    {
        _id: uniqueID_1,
        title: "The book One",
        description: "The best book!",
        authors: "The first author"
    },
    {
        _id: uniqueID_2,
        title: "The book Two",
        description: "A good book...",
        authors: "The second author"
    }
]);

//запрос для поиска по полю title
db.books.find(
    {title: matchingValue}
);

db.books.find(
    {title: matchingValue},
    {authos: 1} //в ответе только поле "авторы"
);

//запрос для редактирования полей по id
db.books.updateOne(
    {_id: idValue},
    {$set: {description: "New descripton", authors: "New authors"}}
)
