class Book {
    constructor(name, writer, isbn,) {
        this.name = name
        this.writer = writer
        this.isbn = isbn
    }
}

class App {
    constructor() {
    }

    formProcess(e){
        let bookName = document.querySelector('#name').value;
        let bookWriter = document.querySelector('#writer').value;
        let bookIsbn = document.querySelector('#isbn').value;

        if (bookName === '' || bookWriter === '' || bookIsbn === '') {
            this.showMessage('Please fill up the form')
        } else {
            let currentJob = e.getAttribute('data-job');
            let book = new Book(bookName, bookWriter, bookIsbn)
            if (currentJob==='add'){
                this.addBook(book)
            } else if (currentJob==='update'){
                this.updateBook(book)
            } else {
                this.showMessage('Invalid Operation.')
            }
        }
    }

    addBook(book) {
        let tableList = document.querySelector('#view-table-body');
        let IsMatchFound = false;
        tableList.childNodes.forEach(function (element) {
            if (element.nodeName === 'TR') {
                if (element.getAttribute('data-id') === book.isbn) {
                    IsMatchFound = true;
                }
            }
        });

        if (!IsMatchFound) {
            let curElNumber = tableList.childElementCount + 1;
            tableList.innerHTML += (`<tr data-id="${book.isbn}"><td>${curElNumber.toString()}</td><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td></tr>`);
        } else {
            this.showMessage(`Insertion failed. ${book.name} book already exists.`)
        }
    }

    updateBook(book) {
        let self = this;
        let tableList = document.querySelector('#view-table-body');
        let IsMatchFound = false;
        tableList.childNodes.forEach(function (element) {
            if (element.nodeName === 'TR') {
                if (element.getAttribute('data-id') === book.isbn) {
                    self.distributeBookData(element, book, 0);
                    IsMatchFound = true;
                }
            }
        });

        if (IsMatchFound) {
            this.showMessage('Book updated successfully.')
        } else {
            this.showMessage('Book updating failed.')
        }
    }


    deleteBook(e){
        let IsRemoved = false;
        let currentBook = e.previousSibling.getAttribute('data-name');
        let isbn = e.getAttribute('data-isbn');
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
            this.showMessage(`${currentBook} book successfully deleted.`)
        } else {
            this.showMessage(`${currentBook} book deletion failed.`)
        }
    }

    showMessage(text) {
        document.querySelector('.content').innerHTML = text;
        document.querySelector('.message').style = 'display:flex;';

        setTimeout(function () {
            document.querySelector('.content').innerHTML = '';
            document.querySelector('.message').style = 'display:none;';
        },1000)
    }

    distributeBookData(parentElement, book, rowNumber= 0) {
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
}

