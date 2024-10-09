document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  // Initialize the table with sample data
  const sampleBooks = [
    new Book('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 'Fiction', '1960-07-11', 5, 281, 100),
    new Book('1984', 'George Orwell', '9780451524935', 'Science Fiction', '1949-06-08', 4, 328, 75),
    new Book('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', '1925-04-10', 4, 180, 100),
    new Book('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Fiction', '1813-01-28', 5, 432, 50),
    new Book('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 'Fiction', '1951-07-16', 4, 234, 25)
  ];

  sampleBooks.forEach(book => app.addBook(book));

  // Navigation functionality
  document.querySelectorAll('.sidebar nav a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const sectionId = e.target.closest('a').getAttribute('data-section');
      app.showSection(sectionId);
    });
  });

  // Add Book button functionality
  app.addBookBtn.addEventListener('click', () => app.openModal(app.bookModal));

  // Book form submission
  app.bookForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const book = new Book(
      app.nameInput.value,
      app.writerInput.value,
      app.isbnInput.value,
      app.genreInput.value,
      app.publicationDateInput.value,
      parseInt(app.ratingInput.value),
      parseInt(app.pagesInput.value),
      0 // Initial progress
    );
    if (app.validateForm(book)) {
      if (app.isbnInput.readOnly) {
        app.updateBook(book);
      } else {
        app.addBook(book);
      }
      app.closeModal(app.bookModal);
      app.resetForm();
    }
  });

  // Cancel button functionality
  document.getElementById('cancel-btn').addEventListener('click', () => {
    app.closeModal(app.bookModal);
    app.resetForm();
  });

  // Export functionality
  app.exportBtn.addEventListener('click', () => app.exportToCSV());

  // Search functionality
  app.searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = app.books.filter(book =>
      Object.values(book).some(value =>
        value.toString().toLowerCase().includes(searchTerm)
      )
    );
    app.renderBooks(filteredBooks);
  });

  // Sorting functionality
  app.sortBtn.addEventListener('click', () => {
    const sortOptions = ['name', 'writer', 'isbn', 'genre', 'publicationDate', 'rating', 'progress'];
    const sortMenu = document.createElement('div');
    sortMenu.className = 'sort-menu';
    sortOptions.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      button.addEventListener('click', () => {
        app.sortBooks(option);
        sortMenu.remove();
      });
      sortMenu.appendChild(button);
    });
    app.sortBtn.parentNode.appendChild(sortMenu);
  });

  // Filtering functionality
  app.filterBtn.addEventListener('click', () => {
    const filterMenu = document.createElement('div');
    filterMenu.className = 'filter-menu';

    const genreFilter = document.createElement('select');
    genreFilter.innerHTML = '<option value="">All Genres</option>' + 
      [...new Set(app.books.map(book => book.genre))].map(genre => 
        `<option value="${genre}">${genre}</option>`
      ).join('');
    genreFilter.addEventListener('change', (e) => app.filterBooks('genre', e.target.value));
    filterMenu.appendChild(genreFilter);

    const ratingFilter = document.createElement('select');
    ratingFilter.innerHTML = '<option value="">All Ratings</option>' + 
      [1, 2, 3, 4, 5].map(rating => 
        `<option value="${rating}">${rating} Star${rating > 1 ? 's' : ''}</option>`
      ).join('');
    ratingFilter.addEventListener('change', (e) => app.filterBooks('rating', e.target.value));
    filterMenu.appendChild(ratingFilter);

    app.filterBtn.parentNode.appendChild(filterMenu);
  });

  // Reading Progress
  app.updateProgressBtn.addEventListener('click', () => app.openProgressModal());

  app.progressForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookId = document.getElementById('progress-book-select').value;
    const progress = parseInt(document.getElementById('progress-pages').value);
    app.updateReadingProgress(bookId, progress);
    app.closeModal(app.progressModal);
  });

  // Book Quotes
  app.addQuoteBtn.addEventListener('click', () => app.openQuoteModal());

  app.quoteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const bookId = document.getElementById('quote-book-select').value;
    const quote = document.getElementById('quote-text').value;
    const page = document.getElementById('quote-page').value;
    app.addBookQuote(bookId, quote, page);
    app.closeModal(app.quoteModal);
  });

  // Reading Challenge
  app.setChallengeBtn.addEventListener('click', () => app.openChallengeModal());

  app.challengeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const goal = parseInt(document.getElementById('challenge-goal').value);
    app.setReadingChallenge(goal);
    app.closeModal(app.challengeModal);
  });

  // Table click events (Edit and Delete)
  app.viewTableElement.addEventListener('click', (e) => {
    if (e.target.classList.contains('btn-edit')) {
      const isbn = e.target.dataset.isbn;
      app.editBook(isbn);
    } else if (e.target.classList.contains('btn-delete')) {
      const isbn = e.target.dataset.isbn;
      if (confirm('Are you sure you want to delete this book?')) {
        app.deleteBook(isbn);
      }
    }
  });

  // Modal close buttons
  document.querySelectorAll('.modal .close').forEach(closeBtn => {
    closeBtn.addEventListener('click', () => {
      closeBtn.closest('.modal').style.display = 'none';
    });
  });

  // Close modals when clicking outside
  window.addEventListener('click', (event) => {
    if (event.target.classList.contains('modal')) {
      event.target.style.display = 'none';
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      app.openModal(app.bookModal);
    } else if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      app.searchInput.focus();
    }
  });

  // Initial render
  app.renderBooks();
  app.updateReadingStats();
  app.showSection('home');
});