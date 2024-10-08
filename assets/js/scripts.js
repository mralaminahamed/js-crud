document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  // Initialize the table with sample data
  const sampleBooks = [
    new Book('To Kill a Mockingbird', 'Harper Lee', '9780446310789', 'Fiction', '1960-07-11', 5),
    new Book('1984', 'George Orwell', '9780451524935', 'Science Fiction', '1949-06-08', 4),
    new Book('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565', 'Fiction', '1925-04-10', 4),
    new Book('Pride and Prejudice', 'Jane Austen', '9780141439518', 'Romance', '1813-01-28', 5),
    new Book('The Catcher in the Rye', 'J.D. Salinger', '9780316769174', 'Fiction', '1951-07-16', 4)
  ];

  sampleBooks.forEach(book => app.books.push(book));
  app.renderBooks();

  // Sorting functionality
  const sortOptions = ['name', 'writer', 'isbn', 'genre', 'publicationDate', 'rating'];
  let currentSortOption = '';
  let sortAscending = true;

  app.toggleSortOptions = () => {
    const sortMenu = document.createElement('div');
    sortMenu.className = 'sort-menu';
    sortOptions.forEach(option => {
      const button = document.createElement('button');
      button.textContent = option.charAt(0).toUpperCase() + option.slice(1);
      button.addEventListener('click', () => {
        currentSortOption = option;
        sortAscending = currentSortOption === option ? !sortAscending : true;
        app.sortBooks(option, sortAscending);
        sortMenu.remove();
      });
      sortMenu.appendChild(button);
    });
    app.sortBtn.parentNode.appendChild(sortMenu);
  };

  app.sortBooks = (option, ascending) => {
    app.books.sort((a, b) => {
      if (a[option] < b[option]) return ascending ? -1 : 1;
      if (a[option] > b[option]) return ascending ? 1 : -1;
      return 0;
    });
    app.renderBooks();
  };

  // Filtering functionality
  app.toggleFilterOptions = () => {
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
  };

  app.filterBooks = (option, value) => {
    const filteredBooks = app.books.filter(book => 
      value === '' || book[option].toString() === value
    );
    app.renderFilteredBooks(filteredBooks);
  };

  // Enhance search functionality
  app.handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredBooks = app.books.filter(book => 
      Object.values(book).some(value => 
        value.toString().toLowerCase().includes(searchTerm)
      )
    );
    app.renderFilteredBooks(filteredBooks);
  };

  // Enhance book count display
  app.updateBookCount = () => {
    app.bookCountElement.textContent = `${app.books.length} book${app.books.length !== 1 ? 's' : ''}`;
  };

  // Override renderBooks method to include book count update
  const originalRenderBooks = app.renderBooks;
  app.renderBooks = () => {
    originalRenderBooks.call(app);
    app.updateBookCount();
  };

  // Enhance createBookRow method to include new fields
  app.createBookRow = (book) => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${book.name}</td>
      <td>${book.writer}</td>
      <td>${book.isbn}</td>
      <td>${book.genre}</td>
      <td>${new Date(book.publicationDate).toLocaleDateString()}</td>
      <td>${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}</td>
      <td class="table-actions">
        <button class="btn btn-sm btn-edit" data-isbn="${book.isbn}">Edit</button>
        <button class="btn btn-sm btn-delete" data-isbn="${book.isbn}">Delete</button>
      </td>
    `;
    return tr;
  };

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      app.toggleForm();
    } else if (e.ctrlKey && e.key === 'f') {
      e.preventDefault();
      app.searchInput.focus();
    }
  });

  // Enhance form validation
  app.validateForm = (book) => {
    if (!book.name || !book.writer || !book.isbn || !book.genre || !book.publicationDate || !book.rating) {
      app.showMessage('Please fill in all fields', 'error');
      return false;
    }
    if (book.rating < 1 || book.rating > 5) {
      app.showMessage('Rating must be between 1 and 5', 'error');
      return false;
    }
    if (!/^\d{13}$/.test(book.isbn)) {
      app.showMessage('ISBN must be a 13-digit number', 'error');
      return false;
    }
    return true;
  };

  // Fix for the initial click on the create button
  app.addBookBtn.addEventListener('click', () => {
    app.toggleForm();
  });

  // Initialize the app
  app.renderBooks();

  // Bind events for sort and filter buttons
  app.sortBtn.addEventListener('click', app.toggleSortOptions);
  app.filterBtn.addEventListener('click', app.toggleFilterOptions);
});
