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

document.querySelector('form').addEventListener('submit', function (e) {
    e.preventDefault();
    (new App()).formProcess(e.submitter);
});


document.querySelector('#add-book-shortcut').addEventListener('click',function (e) {
    e.preventDefault();
    if (e.target.tagName === 'SPAN'){
        if (this.textContent.trim() === '+'){
            e.target.innerHTML = '×';
            document.querySelector('form').style = 'display:flex;';
        } else if (this.textContent.trim() === '×'){
            e.target.innerHTML = '+';
            document.querySelector('form').style = 'display:none;';
        } else {
            App.showMessage('Invalid command.','error')
        }
    }

})