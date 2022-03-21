class Book {
    constructor(name, writer, isbn) {
        this.name = name
        this.writer = writer
        this.isbn = isbn
    }
}

class App {
    constructor() {
        this.viewTableElement = document.querySelector('#view-table-body')
    }

    viewTable(){
        return this.viewTableElement;
    }

    makeEmptyElementValue() {
        document.querySelector('#name').value = '';
        document.querySelector('#writer').value = '';
        document.querySelector('#isbn').value = '';
        document.querySelector('#isbn').removeAttribute('readonly');
        document.querySelector('#submit').value = 'Add Book';
        document.querySelector('#submit').setAttribute('data-job', 'add');
    }

    formProcess(e) {
        let bookName = document.querySelector('#name').value;
        let bookWriter = document.querySelector('#writer').value;
        let bookIsbn = document.querySelector('#isbn').value;

        if (bookName === '' || bookWriter === '' || bookIsbn === '') {
            App.showMessage('Please fill up the form', 'error')
        } else {
            let currentJob = e.getAttribute('data-job');
            let book = new Book(bookName, bookWriter, bookIsbn)
            if (currentJob === 'add') {
                this.addBook(book)
                this.makeEmptyElementValue()
            } else if (currentJob === 'update') {
                this.updateBook(book)
                this.makeEmptyElementValue()
            } else {
                App.showMessage('Invalid Operation.', 'error')
                this.makeEmptyElementValue()
            }
        }
    }

    addBook(book) {
        if (this.isExists('empty-data')){
            this.isExists('empty-data', function (element) {
                element.remove();
            })
        }
        if (!this.isExists(book.isbn)) {
            this.viewTableElement.appendChild(this.makeRow(book.isbn, book));
            App.showMessage(`${book.name} book added successfully.`, 'success')
        } else {
            App.showMessage(`Insertion failed. ${book.name} book already exists.`, 'error')
        }
    }

    updateBook(book) {
        let IsUpdated = false;

        if (this.isExists(book.isbn)){
            let self = this;
            IsUpdated = this.isExists(book.isbn, function (element) {
                self.distributeBookData(element, book, 0);
            })
        }

        if (IsUpdated) {
            App.showMessage('Book updated successfully.', 'success')
        } else {
            App.showMessage('Book updating failed.', 'error')
        }
    }


    deleteBook(e) {
        let IsRemoved = false;
        let currentBook = e.previousSibling.getAttribute('data-name');
        let isbn = e.getAttribute('data-isbn');

        if (this.isExists(isbn)){
           IsRemoved = this.isExists(isbn, function (element) {
                element.remove();
            })
        }

        //clear form values if not empty
        this.makeEmptyElementValue();

        if (IsRemoved) {
            App.showMessage(`${currentBook} book successfully deleted.`, 'success')
        } else {
            //Prevent unexpected error message after successfully deletion specific item.
            if (this.isExists(isbn)){
                App.showMessage(`${currentBook} book deletion failed.`, 'error')
            }
        }
    }

    static showMessage(text, type) {
        document.querySelector('.content').innerHTML = text;
        document.querySelector('.message').style = 'display:flex;';
        if (type !== undefined) {
            document.querySelector('.message').className = `message border-radius-5px box-shadow-default ${type}`;
        }


        setTimeout(function () {
            document.querySelector('.content').innerHTML = '';
            document.querySelector('.message').style = 'display:none;';
        }, 1000)
    }

    distributeBookData(parentElement, book, rowNumber = 0) {
        parentElement.childNodes.forEach(function (childElement, indexNumber) {
            if (indexNumber === 0) {
                //add row serial number, when row number has been provide
                //default value set 0
                if (rowNumber !== 0) {
                    childElement.innerText = rowNumber;
                }
            }
            if (indexNumber === 1) {
                childElement.innerText = book.name;
            }
            if (indexNumber === 2) {
                childElement.innerText = book.writer;
            }
            if (indexNumber === 3) {
                childElement.innerText = book.isbn;
            }
            if (indexNumber === 4) {
                //add name, writer and isbn for edit button
                childElement.firstChild.setAttribute('data-name', book.name)
                childElement.firstChild.setAttribute('data-writer', book.writer)
                childElement.firstChild.setAttribute('data-isbn', book.isbn)

                //add isbn for delete button
                childElement.lastChild.setAttribute('data-isbn', book.isbn)
            }
        });
    }

    bindEditEvent(e) {
        document.querySelector('#name').value = e.target.getAttribute('data-name');
        document.querySelector('#writer').value = e.target.getAttribute('data-writer');
        document.querySelector('#isbn').value = e.target.getAttribute('data-isbn');

        //Replace button value and attribute
        document.querySelector('#submit').value = 'Update Book';
        document.querySelector('#submit').setAttribute('data-job', 'update');
        document.querySelector('#submit').value = 'Update Book';
        document.querySelector('#isbn').setAttribute('readonly', 'readonly');


        if(document.querySelector('form').style.display === 'none'){
            document.querySelector('form').style = 'display:flex;';
        }
    }

    isExists(identifier, callback){
        let IsFound = false;
        this.viewTableElement.childNodes.forEach(function (element) {
            if (element.nodeName === 'TR') {
                if (element.getAttribute('id') === identifier) {
                    if (callback){
                        callback(element);
                    }
                    IsFound = true;
                }
            }
        });

        return IsFound;
    }

    makeRow(rowId, book){
        let tr = document.createElement("tr")
        tr.setAttribute('id', rowId)
        if (book){
            let curElNumber = this.viewTableElement.childElementCount + 1;
            tr.innerHTML = (`<td>${curElNumber.toString()}</td><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button class="background-image box-shadow-dark" id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button class="background-image box-shadow-dark" id="delete" data-isbn="${book.isbn}">Delete</button></td>`);
        } else {
            let td = document.createElement("td")
            td.setAttribute('colspan', '5')
            td.innerText = 'No data exists';
            tr.appendChild(td);
        }
        return tr;
    }
}

