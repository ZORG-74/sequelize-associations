# Sequelize — связи таблиц (Author ↔ Book)

Практическая работа: ассоциации моделей в Sequelize с SQLite.

## Предметная область

Каталог авторов и их книг.

## Тип связи

**Один-ко-многим (1:N)**: один автор → много книг.

- `Author.hasMany(Book, { foreignKey: 'authorId', as: 'books' })`
- `Book.belongsTo(Author, { foreignKey: 'authorId', as: 'author' })`
- Внешний ключ `authorId` создаётся в таблице **books** (в модели, где вызван `belongsTo`).
- Псевдоним `as` повторяется в `include` — иначе Sequelize не найдёт связь.

## Поля

### authors
| Поле    | Тип    | Ограничения |
|---------|--------|-------------|
| id      | INTEGER| PK, автоинкремент |
| name    | STRING | NOT NULL |
| country | STRING | — |
| createdAt / updatedAt | DATETIME | авто |

### books
| Поле     | Тип     | Ограничения |
|----------|---------|-------------|
| id       | INTEGER | PK, автоинкремент |
| title    | STRING  | NOT NULL |
| year     | INTEGER | — |
| genre    | STRING  | — |
| authorId | INTEGER | FK → authors.id |
| createdAt / updatedAt | DATETIME | авто |

## Использованные спец. методы

- `author.createBook({...})` — создание «ребёнка» через «родителя»
- `author.countBooks()` — количество связанных книг
- `book.getAuthor()` — доступ из «ребёнка» (в коде используется через `include`)

## Жадная загрузка

```js
Author.findAll({ include: { model: Book, as: 'books' } });
Book.findOne({ where: { ... }, include: { model: Author, as: 'author' } });