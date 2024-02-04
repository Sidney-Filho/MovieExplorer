document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "02dd4e4bf4792803c07f78fb41cab31b";

  const modalElement = document.getElementById("exampleModal");

  // Event listener para pesquisa de filmes
  document
    .getElementById("searchContainer")
    .addEventListener("submit", (event) => {
      event.preventDefault(); // Impede o envio do formulário padrão
      const searchTerm = document.getElementById("searchInput").value.trim();
      if (searchTerm !== "") {
        // Chame a função para buscar e exibir os resultados da pesquisa
        searchAndDisplayMovies(searchTerm);
      } else if (searchTerm == "") {
        if (modalElement) {
          const myModal = new bootstrap.Modal(modalElement);
          myModal.show();
        }
      }
    });

  // ... (código existente)

  const urlParams = new URLSearchParams(window.location.search);
  const movieId = urlParams.get("movieId");

  if (movieId) {
    // Chame a função para buscar e exibir os detalhes do filme com base no ID
    fetchMovieDetails(movieId);
  } else {
    // Manipulação de erro caso o ID do filme não esteja presente
    console.log(
      "Erro! ID do filme não encontrado, volte para a página inicial"
    );
  }

  function fetchMovieDetails(movieId) {
    // Adapte este trecho para buscar os detalhes do filme usando o ID
    const movieDetailsUrl = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=en-US`;

    fetch(movieDetailsUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na solicitação de detalhes do filme");
        }
        return response.json();
      })
      .then((detailsData) => {
        // Chame a função para exibir os detalhes do filme na página
        displayMovieDetails(detailsData);
      })
      .catch((error) => console.error(error));
  }

  function displayMovieDetails(detailsData) {
    // Adapte este trecho para criar a estrutura HTML e exibir os detalhes do filme
    const containerForDetails = document.createElement("div");
    containerForDetails.classList.add("containerDetails");

    const movieDetailsContainer = document.getElementById(
      "movieDetailsContainer"
    );
    movieDetailsContainer.innerHTML = "";

    const rating = detailsData.vote_average;

    // Exemplo: Crie elementos HTML e adicione as informações do filme
    const ratingPercent = Math.round(rating * 10);

    const divInfo = document.createElement("div");
    divInfo.classList.add("infoDetails");

    const titleElement = document.createElement("h2");
    titleElement.textContent = detailsData.title;

    const releaseDateElement = document.createElement("p");
    releaseDateElement.textContent = `Release Date: ${detailsData.release_date}`;

    const titleOverview = document.createElement("span");
    titleOverview.innerText = "Overview: ";

    const overviewElement = document.createElement("p");
    overviewElement.textContent = detailsData.overview;
    overviewElement.classList.add("desc");

    const containerRate = document.createElement("div");
    containerRate.classList.add("container-rate");

    const rateTitle = document.createElement("p");
    rateTitle.innerText = "Rate: ";
    const ratingElement = document.createElement("span");
    ratingElement.textContent = `${ratingPercent}%`;

    // Adapte conforme necessário para obter a URL correta da imagem
    const posterUrl = `https://image.tmdb.org/t/p/original${detailsData.poster_path}`;
    const posterElement = document.createElement("img");
    posterElement.classList.add("imgDetails");
    posterElement.src = posterUrl;
    posterElement.alt = `Pôster para ${detailsData.title}`;

    // Adicione os elementos à página
    containerForDetails.appendChild(posterElement);
    containerForDetails.appendChild(divInfo);
    divInfo.appendChild(titleElement);
    divInfo.appendChild(releaseDateElement);
    divInfo.appendChild(titleOverview);
    divInfo.appendChild(overviewElement);
    divInfo.appendChild(containerRate);
    containerRate.appendChild(rateTitle);
    containerRate.appendChild(ratingElement);
    movieDetailsContainer.appendChild(containerForDetails);
  }

  // Função para buscar e exibir os resultados da pesquisa
  function searchAndDisplayMovies(query) {
    const searchUrl = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&page=1&query=${query}`;

    fetch(searchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Erro na solicitação de pesquisa da API");
        }
        return response.json();
      })
      .then((data) => {
        // Limpe os filmes existentes antes de adicionar os resultados da pesquisa
        const movieDetailsContainer = document.getElementById(
          "movieDetailsContainer"
        );
        movieDetailsContainer.innerHTML = "";

        if (data.results && data.results.length > 0) {
          // Exiba os resultados da pesquisa
          data.results.forEach((movie) => {
            displayMovieDetails(movie);
          });
        } else {
          // Exiba uma mensagem caso não haja resultados
          const noResultsMessage = document.createElement("p");
          noResultsMessage.textContent = "Nenhum resultado encontrado.";
          movieDetailsContainer.appendChild(noResultsMessage);
        }
      })
      .catch((error) => console.error(error));
  }
});
