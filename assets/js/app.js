class Book {
  constructor(name, writer, isbn, genre, publicationDate, rating, pages = 0, progress = 0) {
    this.name = name;
    this.writer = writer;
    this.isbn = isbn;
    this.genre = genre;
    this.publicationDate = publicationDate;
    this.rating = rating;
    this.pages = pages;
    this.progress = progress;
  }
}

class App {
  constructor() {
    this.books = [];
    this.quotes = [];
    this.readingChallenge = { goal: 0, booksRead: 0 };

    // DOM element selections
    this.viewTableElement = document.querySelector('#books-section table tbody');
    this.bookForm = document.querySelector('#book-modal form');
    this.nameInput = document.querySelector('#book-modal input[placeholder="Book Title"]');
    this.writerInput = document.querySelector('#book-modal input[placeholder="Author"]');
    this.isbnInput = document.querySelector('#book-modal input[placeholder="ISBN"]');
    this.genreInput = document.querySelector('#book-modal select');
    this.publicationDateInput = document.querySelector('#book-modal input[type="date"]');
    this.ratingInput = document.querySelector('#book-modal input[type="number"]');
    this.pagesInput = document.querySelector('#book-modal input[placeholder="Total Pages"]');
    this.submitButton = document.querySelector('#book-modal button[type="submit"]');
    this.addBookBtn = document.querySelector('.user-actions button:first-child');
    this.exportBtn = document.querySelector('.user-actions button:last-child');
    this.searchInput = document.querySelector('.search-wrapper input');
    this.messageSection = document.querySelector('#message-section');
    this.bookCountElement = document.querySelector('#book-count');
    this.sortBtn = document.querySelector('.table-actions button:first-child');
    this.filterBtn = document.querySelector('.table-actions button:last-child');
    this.updateProgressBtn = document.querySelector('#progress-section button');
    this.progressForm = document.querySelector('#progress-modal form');
    this.addQuoteBtn = document.querySelector('#quotes-section button');
    this.quoteForm = document.querySelector('#quote-modal form');
    this.setChallengeBtn = document.querySelector('#challenge-section button');
    this.challengeForm = document.querySelector('#challenge-modal form');

    // Modals
    this.bookModal = document.querySelector('#book-modal');
    this.progressModal = document.querySelector('#progress-modal');
    this.quoteModal = document.querySelector('#quote-modal');
    this.challengeModal = document.querySelector('#challenge-modal');
  }

  addBook(book) {
    if (this.books.some(b => b.isbn === book.isbn)) {
      this.showMessage(`Book with ISBN ${book.isbn} already exists`, 'error');
    } else {
      this.books.push(book);
      this.renderBooks();
      this.updateReadingStats();
      this.showMessage(`${book.name} added successfully`, 'success');
    }
  }

  updateBook(updatedBook) {
    const index = this.books.findIndex(book => book.isbn === updatedBook.isbn);
    if (index !== -1) {
      this.books[index] = updatedBook;
      this.renderBooks();
      this.updateReadingStats();
      this.showMessage(`${updatedBook.name} updated successfully`, 'success');
    } else {
      this.showMessage('Book not found', 'error');
    }
  }

  deleteBook(isbn) {
    const index = this.books.findIndex(book => book.isbn === isbn);
    if (index !== -1) {
      const deletedBook = this.books.splice(index, 1)[0];
      this.renderBooks();
      this.updateReadingStats();
      this.showMessage(`${deletedBook.name} deleted successfully`, 'success');
    } else {
      this.showMessage('Book not found', 'error');
    }
  }

  renderBooks(booksToRender = this.books) {
    this.viewTableElement.innerHTML = '';
    booksToRender.forEach(book => {
      const row = this.createBookRow(book);
      this.viewTableElement.appendChild(row);
    });
    this.updateBookCount(booksToRender.length);
  }

  createBookRow(book) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.name}</td>
      <td>${book.writer}</td>
      <td>${book.isbn}</td>
      <td>${book.genre}</td>
      <td>${new Date(book.publicationDate).toLocaleDateString()}</td>
      <td>${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</td>
      <td>${book.progress}%</td>
      <td>
        <button class="btn btn-sm btn-edit" data-isbn="${book.isbn}">Edit</button>
        <button class="btn btn-sm btn-delete" data-isbn="${book.isbn}">Delete</button>
      </td>
    `;
    return tr;
  }

  editBook(isbn) {
    const book = this.books.find(book => book.isbn === isbn);
    if (book) {
      this.nameInput.value = book.name;
      this.writerInput.value = book.writer;
      this.isbnInput.value = book.isbn;
      this.genreInput.value = book.genre;
      this.publicationDateInput.value = book.publicationDate;
      this.ratingInput.value = book.rating;
      this.pagesInput.value = book.pages;
      this.isbnInput.readOnly = true;
      this.submitButton.textContent = 'Update Book';
      this.openModal(this.bookModal);
    }
  }

  resetForm() {
    this.bookForm.reset();
    this.isbnInput.readOnly = false;
    this.submitButton.textContent = 'Add Book';
  }

  showMessage(text, type) {
    this.messageSection.innerHTML = `<div class="message message-${type}">${text}</div>`;
    setTimeout(() => {
      this.messageSection.innerHTML = '';
    }, 3000);
  }

  updateBookCount(count = this.books.length) {
    this.bookCountElement.textContent = `${count} book${count !== 1 ? 's' : ''}`;
  }

  sortBooks(option) {
    this.books.sort((a, b) => {
      if (a[option] < b[option]) return -1;
      if (a[option] > b[option]) return 1;
      return 0;
    });
    this.renderBooks();
  }

  filterBooks(option, value) {
    const filteredBooks = this.books.filter(book =>
      value === '' || book[option].toString() === value
    );
    this.renderBooks(filteredBooks);
  }

  exportToCSV() {
    const headers = ['Title', 'Author', 'ISBN', 'Genre', 'Publication Date', 'Rating', 'Pages', 'Progress'];
    const csvContent = [
      headers.join(','),
      ...this.books.map(book => 
        `${book.name},${book.writer},${book.isbn},${book.genre},${book.publicationDate},${book.rating},${book.pages},${book.progress}`
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

  validateForm(book) {
    if (!book.name || !book.writer || !book.isbn || !book.genre || !book.publicationDate || !book.rating || !book.pages) {
      this.showMessage('Please fill in all fields', 'error');
      return false;
    }
    if (book.rating < 1 || book.rating > 5) {
      this.showMessage('Rating must be between 1 and 5', 'error');
      return false;
    }
    if (!/^\d{13}$/.test(book.isbn)) {
      this.showMessage('ISBN must be a 13-digit number', 'error');
      return false;
    }
    return true;
  }

  updateReadingProgress(bookId, progress) {
    const book = this.books.find(b => b.isbn === bookId);
    if (book) {
      book.progress = progress;
      this.renderBooks();
      this.updateReadingStats();
      this.showMessage(`Progress updated for ${book.name}`, 'success');
    }
  }

  generateRecommendations() {
    const genres = [...new Set(this.books.map(book => book.genre))];
    return genres.map(genre => ({
      title: `Best ${genre} Book`,
      author: 'Recommended Author',
      genre: genre
    }));
  }

  updateReadingStats() {
    const booksRead = this.books.filter(book => book.progress === 100).length;
    const pagesRead = this.books.reduce((total, book) => total + (book.pages * book.progress / 100), 0);
    const averageRating = this.books.reduce((total, book) => total + book.rating, 0) / this.books.length || 0;

    document.getElementById('books-read-count').textContent = booksRead;
    document.getElementById('pages-read-count').textContent = Math.round(pagesRead);
    document.getElementById('average-rating').textContent = averageRating.toFixed(1);
    document.getElementById('reading-streak').textContent = `${Math.floor(Math.random() * 30)} days`; // Placeholder for demonstration

    // Update home page quick stats
    document.getElementById('total-books').textContent = this.books.length;
    document.getElementById('books-read').textContent = booksRead;
    this.updateChallengeDisplay();
  }

  addBookQuote(bookId, quote, page) {
    const book = this.books.find(b => b.isbn === bookId);
    if (book) {
      this.quotes.push({ book: book.name, quote, page });
      this.renderQuotes();
      this.showMessage('Quote added successfully', 'success');
    }
  }

  renderQuotes() {
    const quotesList = document.getElementById('quotes-list');
    quotesList.innerHTML = this.quotes.map(q => `
      <div class="quote-card">
        <p>"${q.quote}"</p>
        <p>- ${q.book}, page ${q.page}</p>
      </div>
    `).join('');
  }

  setReadingChallenge(goal) {
    this.readingChallenge.goal = goal;
    this.readingChallenge.booksRead = this.books.filter(book => book.progress === 100).length;
    this.updateChallengeDisplay();
    this.showMessage(`New reading challenge set: ${goal} books`, 'success');
  }

  updateChallengeDisplay() {
    const { goal, booksRead } = this.readingChallenge;
    document.getElementById('challenge-goal').textContent = goal;
    document.getElementById('challenge-books-read').textContent = booksRead;
    document.getElementById('challenge-total-books').textContent = goal;
    const progressBar = document.getElementById('challenge-progress-bar');
    if (progressBar) {
      const progressPercentage = goal > 0 ? (booksRead / goal) * 100 : 0;
      progressBar.value = progressPercentage;
    }
    document.getElementById('challenge-progress').textContent = goal > 0 ? `${Math.round((booksRead / goal) * 100)}%` : '0%';
  }

  showSection(sectionId) {
    document.querySelectorAll('.dashboard-content').forEach(section => {
      section.style.display = 'none';
    });
    document.getElementById(`${sectionId}-section`).style.display = 'block';

    // Update content for specific sections
    if (sectionId === 'recommendations') {
      this.renderRecommendations();
    } else if (sectionId === 'stats') {
      this.updateReadingStats();
    } else if (sectionId === 'quotes') {
      this.renderQuotes();
    } else if (sectionId === 'challenge') {
      this.updateChallengeDisplay();
    }
  }

  renderRecommendations() {
    const recommendations = this.generateRecommendations();
    const recommendationsList = document.getElementById('recommendations-list');
    recommendationsList.innerHTML = recommendations.map(book => `
      <div class="recommendation-card">
        <h3>${book.title}</h3>
        <p>by ${book.author}</p>
        <p>Genre: ${book.genre}</p>
      </div>
    `).join('');
  }

  openModal(modal) {
    modal.style.display = 'block';
  }

  closeModal(modal) {
    modal.style.display = 'none';
  }

    openProgressModal() {
      let formHtml = '<select id="progress-book-select">';
      this.books.forEach(book => {
        formHtml += `<option value="${book.isbn}">${book.name}</option>`;
      });
      formHtml += '</select>';
      formHtml += '<input type="number" id="progress-pages" min="0" max="100" step="1">';
      formHtml += '<button type="submit" class="btn btn-primary">Update Progress</button>';

      this.progressForm.innerHTML = formHtml;
      this.openModal(this.progressModal);
    }

    openQuoteModal() {
      this.quoteForm.innerHTML = `
        <div class="form-group">
          <label for="quote-book-select">Select Book</label>
          <select id="quote-book-select" class="form-control">
            ${this.books.map(book => `<option value="${book.isbn}">${book.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="quote-text">Quote</label>
          <textarea id="quote-text" class="form-control" placeholder="Enter the quote" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label for="quote-page">Page Number</label>
          <input type="number" id="quote-page" class="form-control" placeholder="Page number">
        </div>
        <button type="submit" class="btn btn-primary btn-block">Add Quote</button>
      `;
      this.openModal(this.quoteModal);
    }

    openChallengeModal() {
      this.challengeForm.innerHTML = `
        <input type="number" id="challenge-goal" min="1" placeholder="Number of books">
        <button type="submit" class="btn btn-primary">Set Challenge</button>
      `;
      this.openModal(this.challengeModal);
    }
  }