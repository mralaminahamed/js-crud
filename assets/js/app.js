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
    bookList.forEach(function (book, sn) {
        let html = `<tr data-id="${book.isbn}"><td>${++sn}</td><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td></tr>`;
        document.querySelector('#view-table-body').innerHTML += html;
    })
}

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    console.log(e)

    let bookName = document.querySelector('#name').value;
    let bookWriter = document.querySelector('#writer').value;
    let bookIsbn = document.querySelector('#isbn').value;

    if (bookName === '' || bookWriter === '' || bookIsbn === '') {
        alert('Please fill up the form')
    } else {
        let currentJob = e.submitter.getAttribute('data-job');
        let book = new Book(bookName, bookWriter, bookIsbn)

        console.log(e.submitter.getAttribute('data-job'));

        if (currentJob==='add'){
            addBook(book)
        } else if (currentJob==='update'){
            updateBook(book)
        } else {
            console.log(e);
            showMessage('Invalid Operation.')
        }
    }
})

function addBook(book) {
    let tableList = document.querySelector('#view-table-body');
    let IsMatchFound = false;
    tableList.childNodes.forEach(function (element) {
        if (element.nodeName === 'TR') {
            if (element.getAttribute('data-id') === book.isbn) {
                console.log(element);
                IsMatchFound = true;
            }
        }
    });

    if (!IsMatchFound) {
        //distributeBookData()
        let curElNumber = tableList.childElementCount + 1;
        tableList.innerHTML += (`<tr data-id="${book.isbn}"><td>${curElNumber.toString()}</td><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td></tr>`);
    } else {
        showMessage(`Insertion failed. ${book.name} book already exists.`)
    }
}

function updateBook(book) {
    let tableList = document.querySelector('#view-table-body');
    let IsMatchFound = false;
    tableList.childNodes.forEach(function (element) {
        if (element.nodeName === 'TR') {
            if (element.getAttribute('data-id') === book.isbn) {
                console.log(element);
                distributeBookData(element, book, 0);
                IsMatchFound = true;
            }
        }
    });

    if (IsMatchFound) {
        showMessage('Book updated successfully.')
    } else {
        showMessage('Book updating failed.')
    }
}

function showMessage(text) {
    document.querySelector('.content').innerHTML = text;
    document.querySelector('.message').style = 'display:flex;';

    setTimeout(function () {
        document.querySelector('.content').innerHTML = '';
        document.querySelector('.message').style = 'display:none;';
    },1000)
}

function distributeBookData(parentElement, book, rowNumber= 0) {
    parentElement.childNodes.forEach(function (childElement, indexNumber) {
        if (indexNumber ===0){
            //add row serial number, when row number has been provide
            //default value set 0
            if (rowNumber !==0){
                childElement.innerText = rowNumber;
            }
        }
        if (indexNumber ===1){
            childElement.innerText = book.name;
        }
        if (indexNumber ===2){
            childElement.innerText = book.writer;
        }
        if (indexNumber ===3){
            childElement.innerText = book.isbn;
        }
        if (indexNumber ===4){
            //add name, writer and isbn for edit button
            childElement.firstChild.setAttribute('data-name', book.name)
            childElement.firstChild.setAttribute('data-writer', book.writer)
            childElement.firstChild.setAttribute('data-isbn', book.isbn)

            //add isbn for delete button
            childElement.lastChild.setAttribute('data-isbn', book.isbn)
        }
    });
}


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
        console.log()
        let IsRemoved = false;
        let currentBook = e.currentTarget.previousSibling.getAttribute('data-name');
        let isbn = e.currentTarget.getAttribute('data-isbn');
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
            showMessage(`${currentBook} book successfully deleted.`)
        } else {
            showMessage(`${currentBook} book deletion failed.`)
        }
    })
})

// document.querySelector('.close').addEventListener('click',function (e) {
//     console.log(e)
// })
