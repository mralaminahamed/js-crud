class Book {
    name;
    writer;
    isbn;

    constructor(
        name,
        writer,
        isbn,
    ) {
        this.name = name
        this.writer = writer
        this.isbn = isbn
    }
}


let bookList = [new Book('PHP', 'PHP owner', 'ISB12134'),
    new Book('JS', 'JS owner', 'ISB12135')
];


if (bookList.length > 0) {
    bookList.forEach(function (book) {
        let html = `<tr data-id="${book.isbn}"><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td></tr>`;
        document.querySelector('#view-table-body').innerHTML += html;
    })
}

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();

    let bookName = document.querySelector('#name').value;
    let bookWriter = document.querySelector('#writer').value;
    let bookIsbn = document.querySelector('#isbn').value;

    if (bookName === '' || bookWriter === '' || bookIsbn === '') {
        alert('Please fill up the form')
    } else {
        let tableList = document.querySelector('#view-table-body')

        //console.log(tableList)

        tableList.childNodes.forEach(function (element) {
            if (element.nodeName === 'TR') {
                //console.log(element);
                //console.log(bookIsbn);
                if (element.getAttribute('data-id') === bookIsbn) {
                    console.log(element);
                    let book = new Book(bookName, bookWriter, bookIsbn);
                    element.innerHTML = `<td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td>`;
                } else {
                    //let book = new Book(bookName, bookWriter, bookIsbn);
                    //tableList.innerHTML += `<tr data-id="${book.isbn}"><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit">Edit</button><button id="delete">Delete</button></td></tr>`;
                }
            }

        })


    }


})


document.querySelectorAll('#edit').forEach(function (editButton) {
    editButton.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector('#name').value = this.getAttribute('data-name');
        document.querySelector('#writer').value = this.getAttribute('data-writer');
        document.querySelector('#isbn').value = this.getAttribute('data-isbn');

        document.querySelector('#submit').value = 'Update Book';
        document.querySelector('#submit').setAttribute('data-jon', 'update');
    })
})

document.querySelectorAll('#delete').forEach(function (deleteButton) {
    deleteButton.addEventListener('click', function (e) {
        e.preventDefault();
        let IsRemoved = false;
        let isbn = this.getAttribute('data-isbn');
        let tableList = document.querySelector('#view-table-body')

        tableList.childNodes.forEach(function (element) {
            if (element.nodeName === 'TR') {
                if (element.getAttribute('data-id') === isbn) {
                    element.remove();
                    IsRemoved = true;
                }
            }
        })

        if (IsRemoved) {
            alert('Book successfully deleted.')
        } else {
            alert('Book deletion failed.')
        }
    })
})
