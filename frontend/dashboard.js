async function fetchBooks() {
    const response = await fetch("/books");
    const books = await response.json();
    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    books.forEach(book => {
        const li = document.createElement("li");
        li.textContent = `${book.title} by ${book.author} (ISBN: ${book.isbn})`;

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = async () => {
            await fetch(`/books/${book._id}`, { method: "DELETE" });
            alert("✅ Book deleted!");
            fetchBooks();
        };

        li.appendChild(deleteBtn);
        bookList.appendChild(li);
    });
}

document.getElementById("addBookBtn").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const isbn = document.getElementById("isbn").value;

    await fetch("/books/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author, isbn }),
    });

    alert("✅ Book added!");
    fetchBooks();
});

fetchBooks();
