const apiKey = "02dd4e4bf4792803c07f78fb41cab31b"; // Substitua com sua chave de API real

// Passo 1: Pesquise filmes (sem passar um título específico)
const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=1`;

fetch(discoverUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro na solicitação de descoberta da API");
    }
    return response.json();
  })
  .then((data) => {
    // Verifique se há resultados na descoberta
    if (data.results && data.results.length > 0) {
      // Use os IDs dos filmes para obter as imagens e informações adicionais
      const movieIds = data.results.map((movie) => movie.id);

      // Passo 2: Obtenha as imagens e informações adicionais dos filmes usando os IDs
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
    // Aqui, você pode acessar as informações sobre os filmes
    console.log(resultsArray);

    // Exemplo: exibir as informações de cada filme
    resultsArray.forEach(([detailsData, imagesData]) => {
      const title = detailsData.title;
      const releaseDate = detailsData.release_date;
      const rating = detailsData.vote_average;

      const ratingPercent = Math.round(rating * 10);

      // Crie elementos HTML
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
        ratingElement.classList.add("bad-rating");
      } else if (ratingPercent >= 50 && ratingPercent <= 70) {
        ratingElement.classList.add("medium-rating");
      } else if (ratingPercent > 70 && ratingPercent <= 100) {
        ratingElement.classList.add("good-rating");
      }
      ratingElement.textContent = `${ratingPercent}%`;

      // Se houver pôsteres, você pode obter a URL da imagem
      const posters = imagesData.posters;
      if (posters && posters.length > 0) {
        const posterUrl = `https://image.tmdb.org/t/p/original${posters[0].file_path}`;
        posterElement.src = posterUrl;
        posterElement.alt = `Pôster para ${title}`;
      }

      // Adicione os elementos ao container
      movieContainer.appendChild(posterElement);
      infoContainer.appendChild(titleElement);
      infoContainer.appendChild(releaseDateElement);
      infoContainer.appendChild(rateContainer);
      rateContainer.appendChild(ratingElement);
      movieContainer.appendChild(infoContainer);

      // Adicione o container ao DOM (assumindo que você tem um elemento com ID 'moviesContainer')
      const moviesContainer = document.getElementById("moviesContainer");
      moviesContainer.appendChild(movieContainer);
    });
  })
  .catch((error) => console.error(error));

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
      // Limpar os filmes existentes no container antes de exibir os resultados da pesquisa
      const moviesContainer = document.getElementById("moviesContainer");
      moviesContainer.innerHTML = "";

      // Verificar se há resultados na pesquisa
      if (data.results && data.results.length > 0) {
        // Continuar o processo de exibição dos resultados da pesquisa, semelhante ao código existente
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
        throw new Error("Nenhum resultado encontrado na pesquisa de filmes.");
      }
    })
    .then((resultsArray) => {
      // Exibir os resultados da pesquisa
      resultsArray.forEach(([detailsData, imagesData]) => {
        // Restante do código para exibir os resultados da pesquisa, semelhante ao código existente
        const title = detailsData.title;
        const releaseDate = detailsData.release_date;
        const rating = detailsData.vote_average;

        const ratingPercent = Math.round(rating * 10);

        // Crie elementos HTML
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
          ratingElement.classList.add("bad-rating");
        } else if (ratingPercent >= 50 && ratingPercent <= 70) {
          ratingElement.classList.add("medium-rating");
        } else if (ratingPercent > 70 && ratingPercent <= 100) {
          ratingElement.classList.add("good-rating");
        }
        ratingElement.textContent = `${ratingPercent}%`;

        // Se houver pôsteres, você pode obter a URL da imagem
        const posters = imagesData.posters;
        if (posters && posters.length > 0) {
          const posterUrl = `https://image.tmdb.org/t/p/original${posters[0].file_path}`;
          posterElement.src = posterUrl;
          posterElement.alt = `Pôster para ${title}`;
        }

        // Adicione os elementos ao container
        movieContainer.appendChild(posterElement);
        infoContainer.appendChild(titleElement);
        infoContainer.appendChild(releaseDateElement);
        infoContainer.appendChild(rateContainer);
        rateContainer.appendChild(ratingElement);
        movieContainer.appendChild(infoContainer);

        // Adicione o container ao DOM (assumindo que você tem um elemento com ID 'moviesContainer')
        const moviesContainer = document.getElementById("moviesContainer");
        moviesContainer.appendChild(movieContainer);
      });
    })
    .catch((error) => console.error(error));
}

// Adicionar um ouvinte de evento ao formulário de pesquisa
document
  .getElementById("searchBtn")
  .addEventListener("click", function (event) {
    event.preventDefault(); // Impedir o comportamento padrão de envio do formulário
    const searchTerm = document.getElementById("searchInput").value.trim();

    if (searchTerm !== "") {
      searchMovies(searchTerm);
    }
  });
