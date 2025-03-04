document.getElementById("searchBtn").addEventListener("click", async function() {
    const searchQuery = document.getElementById("searchBox").value.toLowerCase();
    const response = await fetch("/books");
    const books = await response.json();

    const bookList = document.getElementById("bookList");
    bookList.innerHTML = "";

    books.forEach(book => {
        if (book.title.toLowerCase().includes(searchQuery)) {
            const li = document.createElement("li");
            li.textContent = `${book.title} by ${book.author} - ${book.isIssued ? "❌ Issued" : "✅ Available"}`;

            if (!book.isIssued) {
                const lendBtn = document.createElement("button");
                lendBtn.textContent = "Lend";
                lendBtn.onclick = async () => {
                    await fetch(`/books/issue/${book._id}`, { method: "PUT" });
                    alert("✅ Book issued successfully!");
                    window.location.reload();
                };
                li.appendChild(lendBtn);
            }
            bookList.appendChild(li);
        }
    });
});
