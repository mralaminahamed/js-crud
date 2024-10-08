class Book {
  constructor(name, writer, isbn, genre, publicationDate, rating) {
    this.name = name;
    this.writer = writer;
    this.isbn = isbn;
    this.genre = genre;
    this.publicationDate = publicationDate;
    this.rating = rating;
  }
}

class App {
  constructor() {
    this.books = [];
    this.viewTableElement = document.querySelector('#view-table-body');
    this.form = document.querySelector('#book-form');
    this.nameInput = document.querySelector('#name');
    this.writerInput = document.querySelector('#writer');
    this.isbnInput = document.querySelector('#isbn');
    this.genreInput = document.querySelector('#genre');
    this.publicationDateInput = document.querySelector('#publication-date');
    this.ratingInput = document.querySelector('#rating');
    this.submitButton = document.querySelector('#submit');
    this.addBookBtn = document.querySelector('#add-book-btn');
    this.exportBtn = document.querySelector('#export-btn');
    this.searchInput = document.querySelector('#search-input');
    this.messageSection = document.querySelector('#message-section');
    this.bookCountElement = document.querySelector('#book-count');
    this.sortBtn = document.querySelector('#sort-btn');
    this.filterBtn = document.querySelector('#filter-btn');

    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleFormSubmit(e));
    this.addBookBtn.addEventListener('click', () => this.toggleForm());
    this.exportBtn.addEventListener('click', () => this.exportToCSV());
    this.viewTableElement.addEventListener('click', (e) => this.handleTableClick(e));
    this.searchInput.addEventListener('input', (e) => this.handleSearch(e));
  }

  handleFormSubmit(e) {
    e.preventDefault();
    const book = new Book(
      this.nameInput.value,
      this.writerInput.value,
      this.isbnInput.value,
      this.genreInput.value,
      this.publicationDateInput.value,
      parseInt(this.ratingInput.value)
    );
    const isUpdate = this.submitButton.textContent === 'Update Book';

    if (this.validateForm(book)) {
      isUpdate ? this.updateBook(book) : this.addBook(book);
      this.resetForm();
      this.toggleForm();
    }
  }

  validateForm(book) {
    // This method will be overridden in scripts.js
    return true;
  }

  addBook(book) {
    if (this.books.some(b => b.isbn === book.isbn)) {
      this.showMessage(`Book with ISBN ${book.isbn} already exists`, 'error');
    } else {
      this.books.push(book);
      this.renderBooks();
      this.showMessage(`${book.name} added successfully`, 'success');
    }
  }

  updateBook(book) {
    const index = this.books.findIndex(b => b.isbn === book.isbn);
    if (index !== -1) {
      this.books[index] = book;
      this.renderBooks();
      this.showMessage(`${book.name} updated successfully`, 'success');
    } else {
      this.showMessage('Book not found', 'error');
    }
  }

  deleteBook(isbn) {
    const index = this.books.findIndex(b => b.isbn === isbn);
    if (index !== -1) {
      const deletedBook = this.books.splice(index, 1)[0];
      this.renderBooks();
      this.showMessage(`${deletedBook.name} deleted successfully`, 'success');
    } else {
      this.showMessage('Book not found', 'error');
    }
  }

  renderBooks() {
    this.viewTableElement.innerHTML = '';
    this.books.forEach(book => {
      const row = this.createBookRow(book);
      this.viewTableElement.appendChild(row);
    });
    this.updateBookCount();
  }

  createBookRow(book) {
    // This method will be overridden in scripts.js
    return document.createElement('tr');
  }

  handleTableClick(e) {
    const target = e.target.closest('button');
    if (!target) return;

    const isbn = target.getAttribute('data-isbn');
    if (target.classList.contains('btn-edit')) {
      this.editBook(isbn);
    } else if (target.classList.contains('btn-delete')) {
      if (confirm('Are you sure you want to delete this book?')) {
        this.deleteBook(isbn);
      }
    }
  }

  editBook(isbn) {
    const book = this.books.find(b => b.isbn === isbn);
    if (book) {
      this.nameInput.value = book.name;
      this.writerInput.value = book.writer;
      this.isbnInput.value = book.isbn;
      this.genreInput.value = book.genre;
      this.publicationDateInput.value = book.publicationDate;
      this.ratingInput.value = book.rating;
      this.isbnInput.readOnly = true;
      this.submitButton.textContent = 'Update Book';
      this.toggleForm(true);
    }
  }

  resetForm() {
    this.form.reset();
    this.isbnInput.readOnly = false;
    this.submitButton.textContent = 'Add Book';
  }

  toggleForm(show = null) {
    if (show === null) {
      this.form.style.display = this.form.style.display === 'none' ? 'block' : 'none';
    } else {
      this.form.style.display = show ? 'block' : 'none';
    }
    this.addBookBtn.innerHTML = this.form.style.display === 'none' 
      ? '<i class="fas fa-plus"></i> Add Book' 
      : '<i class="fas fa-times"></i> Cancel';
  }

  showMessage(text, type) {
    this.messageSection.innerHTML = `<div class="message message-${type}">${text}</div>`;
    setTimeout(() => {
      this.messageSection.innerHTML = '';
    }, 3000);
  }

  handleSearch(e) {
    // This method will be overridden in scripts.js
  }

  renderFilteredBooks(filteredBooks) {
    this.viewTableElement.innerHTML = '';
    filteredBooks.forEach(book => {
      const row = this.createBookRow(book);
      this.viewTableElement.appendChild(row);
    });
    this.updateBookCount(filteredBooks.length);
  }

  updateBookCount(count = null) {
    const bookCount = count !== null ? count : this.books.length;
    this.bookCountElement.textContent = `${bookCount} book${bookCount !== 1 ? 's' : ''}`;
  }

  exportToCSV() {
    const headers = ['Title', 'Author', 'ISBN', 'Genre', 'Publication Date', 'Rating'];
    const csvContent = [
      headers.join(','),
      ...this.books.map(book => 
        `${book.name},${book.writer},${book.isbn},${book.genre},${book.publicationDate},${book.rating}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (navigator.msSaveBlob) {
      navigator.msSaveBlob(blob, 'books.csv');
    } else {
      link.href = URL.createObjectURL(blob);
      link.download = 'books.csv';
      link.click();
    }
  }
}
