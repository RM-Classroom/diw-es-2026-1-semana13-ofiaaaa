const API_KEY = "52e569d8ec6580126593226dffb97ff6"; 
const BASE_URL = "https://api.themoviedb.org/3";
const IMG_URL = "https://image.tmdb.org/t/p/w500";
const LANGUAGE = "pt-BR";

let allMovies = [];

const movieList = document.getElementById("movie-list");
const searchInput = document.getElementById("search");
const btnSearch = document.getElementById("btnSearch");
const messageEl = document.getElementById("message");

async function fetchMovies() {
    const url = `${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=${LANGUAGE}`;

    try {
        showMessage("Carregando filmes...");
        movieList.innerHTML = ""; 

        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error("Erro ao carregar dados da API.");
        }

        const data = await response.json();
        allMovies = data.results;
        return allMovies;

    } catch (error) {
        console.error(error);
        showMessage("Erro ao buscar filmes. Tente novamente mais tarde.");
        return [];
    }
}

function filterMovies() {
    const query = searchInput.value.toLowerCase().trim();
    
    const filtered = allMovies.filter(movie => 
        movie.title.toLowerCase().includes(query)
    );

    renderMovies(filtered);
}

function createMovieCard(movie) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const posterPath = movie.poster_path ? `${IMG_URL}${movie.poster_path}` : "https://via.placeholder.com/500x750?text=Sem+Poster";
    const releaseYear = movie.release_date ? movie.release_date.split("-")[0] : "N/A";
    const overview = movie.overview ? movie.overview.substring(0, 150) + "..." : "Sinopse não disponível.";

    card.innerHTML = `
        <img src="${posterPath}" alt="${movie.title}" class="movie-poster">
        <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-meta">
                <span class="year">${releaseYear}</span>
                <span class="rating">⭐ ${movie.vote_average.toFixed(1)}</span>
            </div>
            <p class="overview">${overview}</p>
        </div>
    `;

    return card;
}

function renderMovies(movies) {
    movieList.innerHTML = ""; 

    if (!movies || movies.length === 0) {
        showMessage("Nenhum filme encontrado com esse nome.");
        return;
    }

    showMessage("");

    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
    });
}

function showMessage(text) {
    messageEl.textContent = text;
}

function init() {

    fetchMovies().then(movies => renderMovies(movies));

    btnSearch.addEventListener("click", filterMovies);

    searchInput.addEventListener("input", filterMovies);
}

init();