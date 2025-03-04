document.getElementById("loginBtn").addEventListener("click", function() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === "user" && password === "1234") {
        localStorage.setItem("userRole", "user");
        window.location.href = "search.html"; // Redirect to search page
    } else if (username === "librarian" && password === "admin") {
        localStorage.setItem("userRole", "librarian");
        window.location.href = "dashboard.html"; // Redirect to librarian dashboard
    } else {
        document.getElementById("errorMessage").textContent = "❌ Invalid username or password!";
    }
});
