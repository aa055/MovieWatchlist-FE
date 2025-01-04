const APILINK =`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${import.meta.env.VITE_MOVIEDB_API_KEY}&page=1`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?&api_key=${import.meta.env.VITE_MOVIEDB_API_KEY}&query=`;
const BE_API_URL = `${import.meta.env.VITE_MOVIEWATCHLIST_BE_API_URL}`;

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

returnMovies(APILINK);
function returnMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      console.log("MovieDB results: ",data.results);
      data.results.forEach((element) => {
        const div_card = document.createElement("div");
        div_card.setAttribute("class", "card");

        const div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        const div_column = document.createElement("div");
        div_column.setAttribute("class", "column");

        const image = document.createElement("img");
        image.setAttribute("class", "thumbnail");
        image.setAttribute("id", "image");

        const title = document.createElement("h3");
        title.setAttribute("id", "title");

        const center = document.createElement("center");

        let encodedPosterPath = encodeURIComponent(element.poster_path);

        title.innerHTML = `
          ${element.title}
          <br>
          <a href="movie.html?id=${element.id}&title=${element.title}">reviews</a>
          <br>
          <a href="#" class="add-to-watchlist" data-id="${element.id}" data-title="${element.title}" data-posterPath="${encodedPosterPath}" data-inwatchlist="false">Add to watchlist</a>
        `;
        image.src = IMG_PATH + element.poster_path;

        center.appendChild(image);
        div_card.appendChild(center);
        div_card.appendChild(title);
        div_column.appendChild(div_card);
        div_row.appendChild(div_column);

        main.appendChild(div_row);
      });
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  main.innerHTML = "";

  const searchItem = search.value;

  if (searchItem) {
    returnMovies(SEARCHAPI + searchItem);
    search.value = "";
  }
});

////// Event Listeners ////////

main.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('add-to-watchlist')) {
    const movieId = e.target.dataset.id;
    const movieTitle = e.target.dataset.title;
    const posterPath = decodeURIComponent(e.target.dataset.posterpath);
    const inWatchlist = e.target.dataset.inwatchlist === 'true';

    if (!inWatchlist) {
      addToWatchlist(movieId, movieTitle, posterPath, e.target);
    } else {
      removeFromWatchlist(movieId, movieTitle, e.target);
    }
  }
});


/////// Watchlist Functions //////////

function addToWatchlist(movieId, movieTitle, posterPath, element) {
  fetch(BE_API_URL + `/api/v1/watchlist/add`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ movieId: movieId, movieTitle: movieTitle, posterPath: posterPath })
  })
  .then(res => res.json())
  .then(data => {
    alert(`'${movieTitle}' added to watchlist!`);
    element.innerText = 'Remove from watchlist';
    element.dataset.inwatchlist = 'true';
  })
  .catch(err => {
    console.error('Error adding to watchlist:', err);
  });
}

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
    element.innerText = 'Add to watchlist';
    element.dataset.inwatchlist = 'false';
  })
  .catch(err => {
    console.error('Error removing from watchlist:', err);
  });
}




