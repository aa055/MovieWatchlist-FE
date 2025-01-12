const APILINK =`https://api.themoviedb.org/3/discover/movie?sort_by=popularity.desc&api_key=${import.meta.env.VITE_MOVIEDB_API_KEY}&page=1`;
const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const SEARCHAPI = `https://api.themoviedb.org/3/search/movie?&api_key=${import.meta.env.VITE_MOVIEDB_API_KEY}&query=`;
const BE_API_URL = `${import.meta.env.VITE_MOVIEWATCHLIST_BE_API_URL}`;

const main = document.getElementById("section");
const form = document.getElementById("form");
const search = document.getElementById("query");

let watchlistIds = new Set();

// // Preload watchlist movie IDs // Load watchlist movie IDs on page load
// async function preloadWatchlist() {
//   fetch(`${BE_API_URL}/api/v1/watchlist`)
//     .then((res) => res.json())
//     .then((data) => {
//       watchlistIds = new Set(data.map((movie) => movie.movieId.toString()));
//       returnMovies(APILINK);
//     })
//     .catch((err) => console.error('Error fetching watchlist:', err));
// }

async function preloadWatchlist(callback) {
  try {
    const response = await fetch(`${BE_API_URL}/api/v1/watchlist`);
    const data = await response.json();

    watchlistIds = new Set(data.map((movie) => movie.movieId.toString()));

    if (callback && typeof callback === 'function') {
      callback(); // Call the provided callback function
    } else {
      returnMovies(APILINK); // Default behavior
    }
  } catch (err) {
    console.error('Error fetching watchlist:', err);
  }
}

preloadWatchlist()

function returnMovies(url) {
  fetch(url)
    .then((res) => res.json())
    .then(function (data) {
      console.log("MovieDB results: ", data.results);
      data.results.forEach((element) => {
        const div_card = document.createElement("div");
        div_card.setAttribute("class", "card");

        const div_row = document.createElement("div");
        div_row.setAttribute("class", "row");

        const div_column = document.createElement("div");
        div_column.setAttribute("class", "column");

        const image_link = document.createElement("a");
        // image_link.setAttribute("class", "movie-link");
        image_link.setAttribute("href", `movie-details.html?id=${element.id}`);

        const image = document.createElement("img");
        image.setAttribute("class", "thumbnail");
        image.setAttribute("id", "image");
        image.src = IMG_PATH + element.poster_path;

        const title = document.createElement("h3");
        title.setAttribute("id", "title");

        const center = document.createElement("center");

        let encodedPosterPath = encodeURIComponent(element.poster_path);
        let inWatchlist = watchlistIds.has(element.id.toString());

        title.innerHTML = `
          <a href="movie-details.html?id=${element.id}" class="movie-link">${element.title}</a>
          <br>
          <a href="movie.html?id=${element.id}&title=${element.title}">reviews</a>
          <br>
          <a href="#" class="add-to-watchlist" 
            data-id="${element.id}" 
            data-title="${element.title}" 
            data-posterpath="${encodedPosterPath}" 
            data-inwatchlist="${inWatchlist}"
            >${inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
          </a>
        `;
        
        console.log(element.id, inWatchlist);

        image_link.appendChild(image)
        center.appendChild(image_link);
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
    watchlistIds.add(movieId);
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
    watchlistIds.delete(movieId);
  })
  .catch(err => {
    console.error('Error removing from watchlist:', err);
  });
}

/////////////////
// To show the genre dropdown

// document.addEventListener('DOMContentLoaded', () => {
//   const genreDropdown = document.getElementById("genreDropdown");

//   fetch('/metadata/genres.json')
//     .then((response) => response.json())
//     .then((data) => {
//       const genres = data.genres;
      
//       genres.forEach((genre) => {
//         const genreLink = document.createElement("a");
//         genreLink.href = `index.html?genre=${genre.id}`;
//         genreLink.textContent = genre.name;
//         genreDropdown.appendChild(genreLink);
//       });
//     })
//     .catch((error) => {
//       console.error("Error loading genres:", error);
//     });
// });


// Fetch and populate genres in the dropdown

document.addEventListener('DOMContentLoaded', async () => {
  const genreDropdown = document.getElementById('genreDropdown');
  const section = document.getElementById('section'); // Main content section

  // Fetch genres dynamically from the local JSON file
  const response = await fetch('metadata/genres.json');
  const genreData = await response.json();

  const genres = genreData.genres;
  let row = document.createElement('div');
  row.classList.add('genre-row');

  genres.forEach((genre, index) => {
    const genreLink = document.createElement('a');
    genreLink.href = '#';
    genreLink.textContent = genre.name;
    genreLink.setAttribute('data-id', genre.id);

    genreLink.addEventListener('click', (e) => {
      e.preventDefault(); // Prevent page reload
      const genreId = genre.id;

      // Clear the main content
      main.innerHTML = '';

      // Create or update the filter heading
      let filterHeading = document.getElementById('filter-heading');
      if (!filterHeading) {
        filterHeading = document.createElement('h2');
        filterHeading.id = 'filter-heading';
        filterHeading.style.textAlign = 'center';
        filterHeading.style.marginBottom = '20px';
        section.prepend(filterHeading);
      }
      filterHeading.textContent = `Filtered by Genre: ${genre.name}`;

      // Reload the watchlist and fetch movies with the selected genre
      preloadWatchlist(() => {
        const genreUrl = `${APILINK}&with_genres=${genreId}`;
        returnMovies(genreUrl);
      });
    });

    row.appendChild(genreLink);

    // Create a new row after every 5 genres
    if ((index + 1) % 5 === 0) {
      genreDropdown.appendChild(row);
      row = document.createElement('div');
      row.classList.add('genre-row');
    }
  });

  // Append any remaining genres in the last row
  if (row.children.length > 0) {
    genreDropdown.appendChild(row);
  }
});



