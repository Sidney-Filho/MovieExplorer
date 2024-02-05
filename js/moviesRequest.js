const apiKey = "02dd4e4bf4792803c07f78fb41cab31b";
let currentPage = 1;
const resultsPerPage = 24;

function fetchMovies(page) {
  const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=${page}&per_page=${resultsPerPage}`;

  fetch(discoverUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na solicitação de descoberta da API");
      }
      return response.json();
    })
    .then((data) => {
      const moviesContainer = document.getElementById("moviesContainer");

      // Limpe os filmes existentes antes de adicionar novos filmes
      moviesContainer.innerHTML = "";

      if (data.results && data.results.length > 0) {
        const movieIds = data.results.map((movie) => movie.id);

        return Promise.all(
          movieIds.map((movieId) => {
            const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
            const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`;

            const detailsPromise = fetch(movieDetailsUrl).then((response) =>
              response.json()
            );
            const imagesPromise = fetch(imagesUrl).then((response) =>
              response.json()
            );

            return Promise.all([detailsPromise, imagesPromise]);
          })
        );
      } else {
        throw new Error("Nenhum resultado encontrado na descoberta de filmes.");
      }
    })
    .then((resultsArray) => {
      resultsArray.forEach(([detailsData, imagesData]) => {
        const title = detailsData.title;
        const releaseDate = detailsData.release_date;
        const rating = detailsData.vote_average;

        const ratingPercent = Math.round(rating * 10);

        const movieContainer = document.createElement("div");
        movieContainer.setAttribute("data-movie-id", detailsData.id);
        movieContainer.classList.add("card-movie");

        const posterElement = document.createElement("img");

        const infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");

        const titleElement = document.createElement("h2");
        titleElement.classList.add("title");
        titleElement.textContent = `${title}`;

        const releaseDateElement = document.createElement("p");
        releaseDateElement.classList.add("date");
        releaseDateElement.textContent = `${releaseDate}`;

        const rateContainer = document.createElement("div");
        const ratingElement = document.createElement("span");
        rateContainer.classList.add("rate");
        if (ratingPercent < 50) {
          ratingElement.classList.add("bg-warning");
        } else if (ratingPercent >= 50 && ratingPercent <= 70) {
          ratingElement.classList.add("bg-warning");
        } else if (ratingPercent > 70 && ratingPercent <= 100) {
          ratingElement.classList.add("bg-success");
        }
        ratingElement.textContent = `${ratingPercent}%`;

        const posters = imagesData.posters;
        if (posters && posters.length > 0) {
          const posterUrl = `https://image.tmdb.org/t/p/original${posters[0].file_path}`;
          posterElement.src = posterUrl;
          posterElement.alt = `Pôster para ${title}`;
        }

        movieContainer.appendChild(posterElement);
        infoContainer.appendChild(titleElement);
        infoContainer.appendChild(releaseDateElement);
        infoContainer.appendChild(rateContainer);
        rateContainer.appendChild(ratingElement);
        movieContainer.appendChild(infoContainer);

        const moviesContainer = document.getElementById("moviesContainer");
        moviesContainer.appendChild(movieContainer);

        // ... (código existente)

        // Event listener para abrir os detalhes do filme em uma nova página
        moviesContainer.addEventListener("click", (event) => {
          const movieContainer = event.target.closest(".card-movie");

          if (movieContainer) {
            const movieId = movieContainer.getAttribute("data-movie-id");
            if (movieId) {
              // Redirecione para a página de detalhes do filme com o ID do filme
              window.location.href = `movie-details.html?movieId=${movieId}`;
            }
          }
        });

        updatePaginationUI();
      });
    })
    .catch((error) => console.error(error));
}

function changePage(change) {
  currentPage += change;
  fetchMovies(currentPage);
}

function updatePaginationUI() {
  const prevPageButton = document.getElementById("prevPage");
  const nextPageButton = document.getElementById("nextPage");

  prevPageButton.disabled = currentPage === 1;
  nextPageButton.disabled = false; // Assuming there's always a next page
}

document
  .getElementById("prevPage")
  .addEventListener("click", () => changePage(-1));
document
  .getElementById("nextPage")
  .addEventListener("click", () => changePage(1));

// Inicialize a página com filmes
fetchMovies(currentPage);

function searchMovies(query) {
  const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=1&query=${query}`;

  fetch(searchUrl)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Erro na solicitação de pesquisa da API");
      }
      return response.json();
    })
    .then((data) => {
      const moviesContainer = document.getElementById("moviesContainer");
      moviesContainer.innerHTML = "";

      if (data.results && data.results.length > 0) {
        const searchResults = data.results.map((movie) => movie.id);

        return Promise.all(
          searchResults.map((movieId) => {
            const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;
            const imagesUrl = `https://api.themoviedb.org/3/movie/${movieId}/images?api_key=${apiKey}`;

            const detailsPromise = fetch(movieDetailsUrl).then((response) =>
              response.json()
            );
            const imagesPromise = fetch(imagesUrl).then((response) =>
              response.json()
            );

            return Promise.all([detailsPromise, imagesPromise]);
          })
        );
      } else {
        const body = document.querySelector("body");
        const containerMessage = document.createElement("div");
        containerMessage.classList.add("container-message-error");
        containerMessage.classList.add("messageError");
        const newMessageError = document.createElement("h2");
        newMessageError.innerText = "Nothing to show here :/";

        const iconError = document.createElement("i");
        iconError.classList.add("fa-solid");
        iconError.classList.add("fa-0");

        const resultsError = document.createElement("span");
        resultsError.innerText = "Results";

        containerMessage.appendChild(newMessageError);
        containerMessage.appendChild(iconError);
        containerMessage.appendChild(resultsError);
        body.appendChild(containerMessage);

        throw new Error("Nenhum resultado encontrado na pesquisa de filmes.");
      }
    })
    .then((resultsArray) => {
      resultsArray.forEach(([detailsData, imagesData]) => {
        const title = detailsData.title;
        const releaseDate = detailsData.release_date;
        const rating = detailsData.vote_average;

        const ratingPercent = Math.round(rating * 10);

        const movieContainer = document.createElement("div");
        movieContainer.classList.add("card-movie");

        const posterElement = document.createElement("img");

        const infoContainer = document.createElement("div");
        infoContainer.classList.add("info-container");

        const titleElement = document.createElement("h2");
        titleElement.classList.add("title");
        titleElement.textContent = `${title}`;

        const releaseDateElement = document.createElement("p");
        releaseDateElement.classList.add("date");
        releaseDateElement.textContent = `${releaseDate}`;

        const rateContainer = document.createElement("div");
        const ratingElement = document.createElement("span");
        rateContainer.classList.add("rate");
        if (ratingPercent < 50) {
          ratingElement.classList.add("bg-danger");
        } else if (ratingPercent >= 50 && ratingPercent <= 70) {
          ratingElement.classList.add("bg-warning");
        } else if (ratingPercent > 70 && ratingPercent <= 100) {
          ratingElement.classList.add("bg-success");
        }
        ratingElement.textContent = `${ratingPercent}%`;

        const posters = imagesData.posters;
        if (posters && posters.length > 0) {
          const posterUrl = `https://image.tmdb.org/t/p/original${posters[0].file_path}`;
          posterElement.src = posterUrl;
          posterElement.alt = `Pôster para ${title}`;
        }

        movieContainer.appendChild(posterElement);
        infoContainer.appendChild(titleElement);
        infoContainer.appendChild(releaseDateElement);
        infoContainer.appendChild(rateContainer);
        rateContainer.appendChild(ratingElement);
        movieContainer.appendChild(infoContainer);

        const moviesContainer = document.getElementById("moviesContainer");
        moviesContainer.appendChild(movieContainer);

        // Event listener para abrir os detalhes do filme em uma nova página
        moviesContainer.addEventListener("click", (event) => {
          const movieContainer = event.target.closest(".card-movie");

          if (movieContainer) {
            const movieId = movieContainer.getAttribute("data-movie-id");
            if (movieId) {
              // Redirecione para a página de detalhes do filme com o ID do filme
              window.location.href = `movie-details.html?movieId=${movieId}`;
            }
          }
        });
      });
      updatePaginationUI();
    })
    .catch((error) => console.error(error));
}

const modalElement = document.getElementById("exampleModal");

document
  .getElementById("searchBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById("searchInput").value.trim();

    if (searchTerm === "") {
      if (modalElement) {
        const myModal = new bootstrap.Modal(modalElement);
        myModal.show();
      } else {
        console.error("Elemento modal não encontrado.");
      }
    } else {
      searchMovies(searchTerm);
    }
  });

document.addEventListener("DOMContentLoaded", () => {
  // Event listener para abrir os detalhes do filme em uma nova página
  const moviesContainer = document.getElementById("moviesContainer");
  moviesContainer.addEventListener("click", (event) => {
    const movieLink = event.target.closest(".card-movie");

    if (movieLink) {
      const movieId = movieLink.getAttribute("data-movie-id");
      if (movieId) {
        // Redirecione para a página de detalhes do filme
        window.location.href = `movie-details.html?movieId=${movieId}`;
      }
    }
  });
});
