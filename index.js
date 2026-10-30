const { sequelize, Author, Book } = require('./models');

async function main() {
  try {
    // 1. Проверка подключения
    await sequelize.authenticate();
    console.log('✅ Подключение к SQLite установлено');

    // 2. Синхронизация — создаёт authors и books (с authorId)
    await sequelize.sync({ force: true });
    console.log('✅ Таблицы "authors" и "books" синхронизированы');

    // 3. Создаём «родителя»
    const tolkien = await Author.create({
      name: 'J.R.R. Tolkien',
      country: 'United Kingdom',
    });
    const rowling = await Author.create({
      name: 'J.K. Rowling',
      country: 'United Kingdom',
    });
    console.log('✅ Авторы созданы');

    // 4. Создаём «детей» ЧЕРЕЗ СПЕЦИАЛЬНЫЙ МЕТОД createBook
    //    (это метод, который Sequelize добавил в экземпляр Author из-за hasMany)
    await tolkien.createBook({ title: 'The Hobbit',        year: 1937, genre: 'Fantasy' });
    await tolkien.createBook({ title: 'The Fellowship of the Ring', year: 1954, genre: 'Fantasy' });
    await tolkien.createBook({ title: 'The Return of the King',     year: 1955, genre: 'Fantasy' });

    await rowling.createBook({ title: "Harry Potter and the Philosopher's Stone", year: 1997, genre: 'Fantasy' });
    await rowling.createBook({ title: 'Harry Potter and the Chamber of Secrets',  year: 1998, genre: 'Fantasy' });

    console.log('✅ Книги добавлены через специальный метод createBook()');

    // 5. Демонстрация других спец. методов: countBooks, getBooks
    const count = await tolkien.countBooks();
    console.log(`📊 У автора "${tolkien.name}" книг: ${count}`);

    // 6. Жадная загрузка через include с псевдонимом 'books'
    const authorsWithBooks = await Author.findAll({
      include: {
        model: Book,
        as: 'books',         // ⚠️ псевдоним ОБЯЗАТЕЛЬНО повторяем в include
      },
      order: [['id', 'ASC']],
    });

    // 7. Вывод в читаемом виде
    console.log('\n📚 Авторы и их книги:\n');
    authorsWithBooks.forEach((author) => {
      console.log(`👤 ${author.name} (${author.country || '—'})`);
      if (author.books.length === 0) {
        console.log('   — нет книг');
      } else {
        author.books.forEach((book) => {
          console.log(`   • "${book.title}" — ${book.year}, ${book.genre}`);
        });
      }
      console.log('');
    });

    // 8. Обратная жадная загрузка: книга → автор (as: 'author')
    const oneBook = await Book.findOne({
      where: { title: 'The Hobbit' },
      include: { model: Author, as: 'author' },
    });
    console.log('🔎 Обратный запрос (Book → Author):');
    console.log(`   "${oneBook.title}" написана: ${oneBook.author.name}\n`);

  } catch (err) {
    console.error('❌ Ошибка:', err);
  } finally {
    // 9. Закрытие соединения
    await sequelize.close();
    console.log('🔒 Соединение с базой данных закрыто');
  }
}

main();