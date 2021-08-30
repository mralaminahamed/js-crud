(function () {
    //initialize element null value of form
    let bookApp = new App();
    let viewTableBody = bookApp.viewTable();

    bookApp.makeEmptyElementValue();

    //add observer
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                //Table body count one text child on row update state
                if (mutation.target.nodeName==='TBODY'){
                    if (mutation.target.childNodes.length === 1){
                        mutation.target.appendChild(
                            bookApp.makeRow('empty-data')
                        )
                    }
                }

                document.querySelectorAll('#edit').forEach(function (editButton) {
                    editButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        bookApp.bindEditEvent(e);
                    })
                })

                document.querySelectorAll('#delete').forEach(function (deleteButton) {
                    deleteButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        bookApp.deleteBook(e.currentTarget);
                    })
                })
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(viewTableBody, { childList: true, subtree: true });

    //Actually table body has zero child, on document ready state
    if (viewTableBody.childElementCount=== 0){
        viewTableBody.appendChild(
            bookApp.makeRow('empty-data')
        )
    }
})();



// let bookList = [new Book('PHP', 'PHP owner', 'ISB12134'),
//     new Book('JS', 'JS owner', 'ISB12135')
// ];


// if (bookList.length > 0) {
//     bookList.forEach(function (book, sn) {
//         let html = `<tr data-id="${book.isbn}"><td>${++sn}</td><td>${book.name}</td><td>${book.writer}</td><td>${book.isbn}</td><td><button id="edit" data-name="${book.name}" data-writer="${book.writer}" data-isbn="${book.isbn}">Edit</button><button id="delete" data-isbn="${book.isbn}">Delete</button></td></tr>`;
//         document.querySelector('#view-table-body').innerHTML += html;
//     })
// }

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    (new App()).formProcess(e.submitter);
});
