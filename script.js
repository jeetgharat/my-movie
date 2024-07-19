document.addEventListener('DOMContentLoaded', () => {
    const API_URL = 'https://www.omdbapi.com/?apikey=47a0fe11';

    const movieListElement = document.getElementById('movie-list');
    const backdropElement = document.getElementById('backdrop');
    const posterElement = document.getElementById('poster');
    const movieTitleElement = document.getElementById('movie-title');
    const plotElement = document.getElementById('plot');
    const typeElement = document.getElementById('type');
    const releaseDateElement = document.getElementById('release-date');
    const runtimeElement = document.getElementById('runtime');
    const genreElement = document.getElementById('genre');

    function fetchMovies(query = 'Avengers') {
        fetch(`${API_URL}&s=${query}`)
            .then(response => response.json())
            .then(data => displayMovies(data.Search))
            .catch(error => console.error('Error fetching movies:', error));
    }

    function fetchMovieRating(imdbID) {
        return fetch(`${API_URL}&i=${imdbID}`)
            .then(response => response.json())
            .then(data => parseFloat(data.imdbRating))
            .catch(error => {
                console.error('Error fetching movie rating:', error);
                return null;
            });
    }

    async function displayMovies(movies) {
        if (!movieListElement) return; // Only run this if on the movie list page

        movieListElement.innerHTML = '';

        for (const movie of movies) {
            const rating = await fetchMovieRating(movie.imdbID);
            const movieItem = document.createElement('div');
            movieItem.className = 'relative bg-gray-800 p-4 rounded shadow cursor-pointer';

            movieItem.innerHTML = `
                <div class="flex items-center mb-2">
                    <div class="text-yellow-400 mr-1">
                        ⭐
                    </div>
                    <div class="bg-gray-900 text-yellow-400 p-1 rounded">
                        ${rating ? rating.toFixed(1) : 'No rating'}
                    </div>
                </div>
                <img src="${movie.Poster}" alt="${movie.Title}" class="w-full h-64 object-cover rounded">
                <h2 class="text-lg font-semibold mt-2">${movie.Title}</h2>
                <p class="text-sm text-gray-400">${movie.Year}</p>
            `;

            movieItem.addEventListener('click', () => {
                window.location.href = `details.html?id=${movie.imdbID}`;
            });

            movieListElement.appendChild(movieItem);
        }
    }

    function fetchMovieDetails(imdbID) {
        fetch(`${API_URL}&i=${imdbID}`)
            .then(response => response.json())
            .then(data => displayMovieDetails(data))
            .catch(error => console.error('Error fetching movie details:', error));
    }

    function displayMovieDetails(movie) {
        if (!backdropElement || !posterElement || !movieTitleElement || !plotElement || !typeElement || !releaseDateElement || !runtimeElement || !genreElement) return;

        backdropElement.src = movie.Poster;
        posterElement.src = movie.Poster;
        movieTitleElement.textContent = movie.Title;
        plotElement.textContent = movie.Plot;
        typeElement.textContent = movie.Type;
        releaseDateElement.textContent = movie.Released;
        runtimeElement.textContent = movie.Runtime;
        genreElement.textContent = movie.Genre;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const movieID = urlParams.get('id');

    if (movieID) {
        fetchMovieDetails(movieID);
    } else {
        fetchMovies();

        const searchInput = document.getElementById('search-input');
        searchInput.addEventListener('input', () => {
            fetchMovies(searchInput.value);
        });
    }
});
