# Movie Watchlist Website - Frontend

A modern, responsive movie browsing and watchlist management application built with vanilla JavaScript and Vite. Browse popular movies, search for specific titles, filter by genre, and maintain your personal watchlist.

## Features

- **Movie Discovery**: Browse popular movies with detailed information
- **Search Functionality**: Search for movies by title
- **Genre Filtering**: Filter movies by genre categories
- **Watchlist Management**: Add and remove movies from your personal watchlist
- **Movie Details**: View detailed information about each movie
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## Tech Stack

- **HTML5** - Markup structure
- **CSS3** - Styling and responsive design
- **JavaScript (ES6+)** - Application logic
- **Vite** - Build tool and development server
- **The Movie Database (TMDb) API** - Movie data source
- **Backend API** - Custom watchlist management API

## Prerequisites

Before running this project, ensure you have:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A TMDb API key (get one at [themoviedb.org](https://www.themoviedb.org/settings/api))
- Backend API running (for watchlist functionality)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd MovieWatchlist-FE
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add your environment variables:
```env
VITE_MOVIEDB_API_KEY=your_tmdb_api_key_here
VITE_MOVIEWATCHLIST_BE_API_URL=your_backend_api_url
```

## Usage

### Development Server

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

Create a production build:
```bash
npm run build
```

The optimized files will be in the `dist` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
MovieWatchlist-FE/
├── index.html              # Home page
├── movie.html              # Movie browsing page
├── movie-details.html      # Movie details page
├── watchlist.html          # Watchlist page
├── script.js               # Home page logic
├── movie.js                # Movie browsing logic
├── movie-details.js        # Movie details logic
├── watchlist.js            # Watchlist logic
├── style.css               # Global styles
├── package.json            # Project dependencies
├── vite.config.js          # Vite configuration
└── metadata/
    └── genres.json         # Genre data
```

## Pages

### Home (`index.html`)
- Displays popular movies
- Search functionality
- Genre dropdown navigation
- Quick access to watchlist

### Movie Browsing (`movie.html`)
- Browse movies by genre or search
- Add/remove movies from watchlist
- View movie ratings and details

### Movie Details (`movie-details.html`)
- Detailed movie information
- Cast and crew details
- Reviews and ratings
- Add to watchlist option

### Watchlist (`watchlist.html`)
- View all saved movies
- Remove movies from watchlist
- Quick access to movie details

## API Integration

This frontend integrates with two APIs:

1. **TMDb API**: For movie data, images, and search
2. **Backend API**: For watchlist CRUD operations

### Backend API Endpoints Used:
- `GET /api/v1/watchlist` - Fetch user's watchlist
- `POST /api/v1/watchlist` - Add movie to watchlist
- `DELETE /api/v1/watchlist/:id` - Remove movie from watchlist

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_MOVIEDB_API_KEY` | Your TMDb API key | Yes |
| `VITE_MOVIEWATCHLIST_BE_API_URL` | Backend API base URL | Yes |

## Features in Detail

### Watchlist Synchronization
The application preloads watchlist IDs on page load to show real-time watchlist status for each movie.

### Responsive Navigation
- Sticky navigation bar
- Dropdown genre menu
- Integrated search bar
- Mobile-friendly design

### Dynamic Content
- Movies load dynamically via API calls
- Real-time search results
- Genre-based filtering
- Interactive movie cards

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Acknowledgments

- [The Movie Database (TMDb)](https://www.themoviedb.org/) for providing the movie data API
- [Vite](https://vitejs.dev/) for the blazing fast build tool

## Contact

For questions or support, please open an issue in the repository.

---

**Note**: Make sure your backend API is running before starting the frontend application for full functionality.
