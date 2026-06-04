// Manage the books here
class Book {
    constructor(title, author, pages, isRead = false, id = crypto.randomUUID()) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.pages = pages;
        this.isRead = isRead;
    }

    toggleReadStatus() {
        this.isRead = !this.isRead;
    }
}

// Functions to manage the library
class Library {
    constructor() {
        this.books = this.loadFromLocalStorage();
    }

    addBook(book) {
        this.books.push(book);
        this.saveToLocalStorage();
    }

    deleteBook(id) {
        this.books = this.books.filter(book => book.id !== id);
        this.saveToLocalStorage();
    }

    updateBook(id, updatedData) {
        const book = this.books.find(b => b.id === id);
        if (book) {
            book.title = updatedData.title;
            book.author = updatedData.author;
            book.pages = updatedData.pages;
            book.isRead = updatedData.isRead;
            this.saveToLocalStorage();
        }
    }

    getBook(id) {
        return this.books.find(b => b.id === id);
    }

    saveToLocalStorage() {
        localStorage.setItem('library', JSON.stringify(this.books));
    }

    loadFromLocalStorage() {
        const data = localStorage.getItem('library');
        return data ? JSON.parse(data) : [];
    }
}

// UI interactions and rendering
class LibraryUI {
    constructor() {
        this.library = new Library();
        this.currentEditingId = null;
        this.initEventListeners();
        this.displayBooks();
    }

    initEventListeners() {
        // Add book form submission
        document.getElementById('bookForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.addBook();
        });

        // Modal
        const modal = document.getElementById('editModal');
        const closeBtn = document.querySelector('.close');

        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });

        // Update book
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.updateBook();
        });
    }

    addBook() {
        const title = document.getElementById('bookTitle').value.trim();
        const author = document.getElementById('bookAuthor').value.trim();
        const pages = parseInt(document.getElementById('bookPages').value);
        const isRead = document.getElementById('bookRead').checked;

        if (!title || !author || !pages) {
            alert('Please fill in all fields!');
            return;
        }

        const book = new Book(title, author, pages, isRead);
        this.library.addBook(book);

        // Clear the form
        document.getElementById('bookForm').reset();

        // Book display
        this.displayBooks();
    }

    displayBooks() {
        const bookList = document.getElementById('bookList');
        bookList.innerHTML = '';

        if (this.library.books.length === 0) {
            bookList.innerHTML = '<p class="empty-message">You haven\'t added any books yet.</p>';
            return;
        }

        this.library.books.forEach(book => {
            const bookCard = this.createBookCard(book);
            bookList.appendChild(bookCard);
        });
    }

    createBookCard(book) {
        const div = document.createElement('div');
        div.className = 'book-card';

        const readStatus = book.isRead 
            ? `<span class="read-status read">✓ Read</span>` 
            : `<span class="read-status unread">✗ Not Read</span>`;

        div.innerHTML = `
            <h3>${book.title}</h3>
            <div class="book-info">
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Pages:</strong> ${book.pages}</p>
                <p><strong>Status:</strong> ${readStatus}</p>
            </div>
            <div class="book-actions">
                <button class="btn btn-edit" data-id="${book.id}">Edit</button>
                <button class="btn btn-delete" data-id="${book.id}">Delete</button>
            </div>
        `;

        // Edit button
        div.querySelector('.btn-edit').addEventListener('click', () => {
            this.openEditModal(book.id);
        });

        // Delete button
        div.querySelector('.btn-delete').addEventListener('click', () => {
            if (confirm(`Are you sure you want to delete "${book.title}"?`)) {
                this.deleteBook(book.id);
            }
        });

        return div;
    }

    openEditModal(id) {
        const book = this.library.getBook(id);
        if (!book) return;

        this.currentEditingId = id;

        document.getElementById('editTitle').value = book.title;
        document.getElementById('editAuthor').value = book.author;
        document.getElementById('editPages').value = book.pages;
        document.getElementById('editRead').checked = book.isRead;

        document.getElementById('editModal').style.display = 'block';
    }

    updateBook() {
        const title = document.getElementById('editTitle').value.trim();
        const author = document.getElementById('editAuthor').value.trim();
        const pages = parseInt(document.getElementById('editPages').value);
        const isRead = document.getElementById('editRead').checked;

        if (!title || !author || !pages) {
            alert('Please fill in all fields!');
            return;
        }

        this.library.updateBook(this.currentEditingId, {
            title,
            author,
            pages,
            isRead
        });

        document.getElementById('editModal').style.display = 'none';
        this.displayBooks();
    }

    deleteBook(id) {
        this.library.deleteBook(id);
        this.displayBooks();
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    new LibraryUI();
});
