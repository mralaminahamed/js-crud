(function () {
    //initialize element null value of form
    (new App()).makeEmptyElementValue();


    //add observer
    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(function (mutationsList, observer) {
        // Use traditional 'for loops' for IE 11
        for(const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                document.querySelectorAll('#edit').forEach(function (editButton) {
                    editButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        (new App()).bindEditEvent(e);
                    })
                })

                document.querySelectorAll('#delete').forEach(function (deleteButton) {
                    deleteButton.addEventListener('click', function (e) {
                        e.preventDefault();
                        (new App()).deleteBook(e.currentTarget);
                    })
                })
            }
        }
    });

    // Start observing the target node for configured mutations
    observer.observe(
        document.querySelector('#view-table-body'),
        { childList: true, subtree: true }
    );

})();


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
    (new App()).formProcess(e.submitter);
});
