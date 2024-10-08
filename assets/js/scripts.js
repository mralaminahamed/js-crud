document.addEventListener('DOMContentLoaded', () => {
  const app = new App();

  // Initialize the table with sample data
  const sampleBooks = [
    new Book('To Kill a Mockingbird', 'Harper Lee', '9780446310789'),
    new Book('1984', 'George Orwell', '9780451524935'),
    new Book('The Great Gatsby', 'F. Scott Fitzgerald', '9780743273565')
  ];

  sampleBooks.forEach(book => app.addBook(book));

  // Add sorting functionality
  const tableHeaders = document.querySelectorAll('.books-table th');
  tableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const index = Array.from(header.parentNode.children).indexOf(header);
      const isAscending = header.classList.toggle('sort-asc');
      app.books.sort((a, b) => {
        const aValue = Object.values(a)[index];
        const bValue = Object.values(b)[index];
        return isAscending ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
      });
      app.renderBooks();
    });
  });

  // Add keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'b') {
      e.preventDefault();
      app.toggleForm();
    }
  });

  // Add form validation
  app.form.querySelectorAll('input[type="text"]').forEach(input => {
    input.addEventListener('input', () => {
      input.setCustomValidity('');
      input.checkValidity();
    });

    input.addEventListener('invalid', () => {
      if (input.value === '') {
        input.setCustomValidity('This field is required');
      }
    });
  });

  // Initialize tooltips
  const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
  tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl);
  });
});
