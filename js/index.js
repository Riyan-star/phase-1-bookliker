document.addEventListener("DOMContentLoaded", function() {});
document.addEventListener("DOMContentLoaded", () => {
  fetchBooks();
});

function fetchBooks() {
  fetch("http://localhost:3000/books")
    .then(res => res.json())
    .then(books => {
      books.forEach(renderBookTitle);
    });
}

function renderBookTitle(book) {
  const li = document.createElement("li");
  li.textContent = book.title;
  li.addEventListener("click", () => showBookDetails(book));
  document.getElementById("list").appendChild(li);
}
function showBookDetails(book) {
  const panel = document.getElementById("show-panel");
  panel.innerHTML = `
    <img src="${book.img_url}" />
    <h3>${book.title}</h3>
    <p>${book.description}</p>
    <ul id="user-list">
      ${book.users.map(user => `<li>${user.username}</li>`).join("")}
    </ul>
    <button id="like-btn">LIKE</button>
  `;

  document.getElementById("like-btn").addEventListener("click", () => {
    toggleLike(book);
  });
}
const currentUser = { id: 1, username: "pouros" };

function toggleLike(book) {
  const userIndex = book.users.findIndex(u => u.id === currentUser.id);
  let updatedUsers;

  if (userIndex > -1) {
    // Un-like
    updatedUsers = book.users.filter(u => u.id !== currentUser.id);
  } else {
    // Like
    updatedUsers = [...book.users, currentUser];
  }

  fetch(`http://localhost:3000/books/${book.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ users: updatedUsers }),
  })
    .then(res => res.json())
    .then(updatedBook => showBookDetails(updatedBook)); // Refresh the panel
}
