document.getElementById("addBook").addEventListener("click", async () => {
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;

    await fetch("/books/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, author })
    });

    alert("✅ Book Added!");
});
