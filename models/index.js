const sequelize = require('../db');
const Author = require('./author');
const Book = require('./book');

// 1:N — Author hasMany Book, Book belongsTo Author
// as — псевдонимы, понадобятся в include
// foreignKey — явное имя внешнего ключа в таблице books
Author.hasMany(Book, {
  foreignKey: 'authorId',
  as: 'books',
  onDelete: 'CASCADE',
});

Book.belongsTo(Author, {
  foreignKey: 'authorId',
  as: 'author',
});

module.exports = { sequelize, Author, Book };