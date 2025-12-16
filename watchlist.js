const BE_API_URL = `${import.meta.env.VITE_MOVIEWATCHLIST_BE_API_URL}`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const main = document.getElementById("section");

// Fetch and display watchlist movies
fetchWatchlist();

function fetchWatchlist() {
  fetch(BE_API_URL + '/api/v1/watchlist')
    .then(res => res.json())
    .then(data => {
      if (data.length === 0) {
        main.innerHTML = '<h2>No movies in your watchlist</h2>';
        return;
      }
      data.forEach(element => {
        const div_card = document.createElement("div");
        div_card.setAttribute("class", "card");

        const div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        const div_column = document.createElement("div");
        div_column.setAttribute("class", "column");

        const image = document.createElement("img");
        image.setAttribute("class", "thumbnail");
        image.src = IMG_PATH + element.posterPath;

        const title = document.createElement("h3");
        title.innerHTML = `
          ${element.movieTitle}
          <br>
          <a href="movie.html?id=${element.movieId}&title=${element.movieTitle}">Reviews</a>
          <br>
          <a href="#" class="remove-from-watchlist" data-id="${element.movieId}" data-title="${element.movieTitle}">Remove from watchlist</a>
        `;

        const center = document.createElement("center");
        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        main.appendChild(div_row);
      });
    })
    .catch(err => console.error("Error fetching watchlist:", err));
}

// Handle remove from watchlist
main.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('remove-from-watchlist')) {
    const movieId = e.target.dataset.id;
    const movieTitle = e.target.dataset.title;
    removeFromWatchlist(movieId, movieTitle, e.target);
  }
});


function removeFromWatchlist(movieId, movieTitle, element) {
    fetch(`${BE_API_URL}/api/v1/watchlist/${movieId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    })
    .then(res => res.json())
    .then(data => {
      alert(`'${movieTitle}' removed from watchlist!`);
      element.closest('.row').remove();
    })
    .catch(err => {
      console.error('Error removing from watchlist:', err);
    });
  }
