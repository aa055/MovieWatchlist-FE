const IMG_PATH = "https://image.tmdb.org/t/p/w1280";
const API_KEY = import.meta.env.VITE_MOVIEDB_API_KEY;
const API_URL = "https://api.themoviedb.org/3/movie/";

const movieDetailsContainer = document.getElementById("movie-details");
const movieTitleElement = document.getElementById("movie-title");

// Get movieId from URL
const urlParams = new URLSearchParams(window.location.search);
const movieId = urlParams.get('id');

// Fetch movie details by movieId
async function getMovieDetails(movieId) {
  try {
    const response = await fetch(`${API_URL}${movieId}?api_key=${API_KEY}`);
    const movieData = await response.json();
    console.log("Movie Details:", movieData);

    // Display title and basic info
    movieTitleElement.innerText = movieData.title;

    const genres = movieData.genres.map(genre => genre.name).join(", ");
    const originCountries = movieData.origin_country.map(country => country).join(", ");

    movieDetailsContainer.innerHTML = `
        <div style="display:flex;">
            <div style="display:block;"> <img class="thumbnail" src="${IMG_PATH + movieData.poster_path}" alt="${movieData.title}" /></div>
            <div style="display:block; padding:20px;">
                <p><strong>Release Date:</strong> ${movieData.release_date}</p>
                <p><strong>Original Language:</strong> ${movieData.original_language.toUpperCase()}</p>
                <p><strong>Genres:</strong> ${genres}</p>
                <p><strong>Budget:</strong> $${movieData.budget.toLocaleString()}</p>
                <p><strong>Revenue:</strong> $${movieData.revenue.toLocaleString()}</p>
                <p><strong>Origin:</strong> ${originCountries}</p>
            </div>
        </div>
        <p><strong>Overview:</strong> ${movieData.overview}</p>

    `;
  } catch (error) {
    console.error("Error fetching movie details:", error);
    movieTitleElement.innerText = "Error loading movie details.";
    movieDetailsContainer.innerHTML = `<p>Error loading movie details. Please try again later.</p>`;
  }
}

// Trigger fetch if movieId exists
if (movieId) {
  getMovieDetails(movieId);
} else {
  movieTitleElement.innerText = "No movie selected.";
}

