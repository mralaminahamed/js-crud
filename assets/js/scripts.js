let bookList = [new Book('PHP', 'PHP owner', 'ISB12134'),
    new Book('JS', 'JS owner', 'ISB12135')
];


if (bookList.length > 0) {
    bookList.forEach(function (book, sn) {
        let html = `<tr data-id="${book.isbn}"><td>${++sn}</td><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td></tr>`;
        document.querySelector('#view-table-body').innerHTML += html;
    })
}

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    let app = new App();
    app.formProcess(e.submitter);
});

document.querySelectorAll('#edit').forEach(function (editButton) {
    editButton.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#name').value = this.getAttribute('data-name');
        document.querySelector('#writer').value = this.getAttribute('data-writer');
        document.querySelector('#isbn').value = this.getAttribute('data-isbn');

        document.querySelector('#submit').value = 'Update Book';
        document.querySelector('#submit').setAttribute('data-job', 'update');
    })
})

document.querySelectorAll('#delete').forEach(function (deleteButton) {
    deleteButton.addEventListener('click', function (e) {
        e.preventDefault();
        let app = new App();
        app.deleteBook(e.currentTarget);
    })
})

// document.querySelector('.close').addEventListener('click',function (e) {
//     console.log(e)
// })
