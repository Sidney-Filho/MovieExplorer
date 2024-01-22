const apiKey = "02dd4e4bf4792803c07f78fb41cab31b"; 


const discoverUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&language=en-US&page=1`;

fetch(discoverUrl)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Erro na solicitação de descoberta da API");
    }
    return response.json();
  })
  .then((data) => {
    
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
   
    console.log(resultsArray);

    
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
        ratingElement.classList.add("bad-rating");
      } else if (ratingPercent >= 50 && ratingPercent <= 70) {
        ratingElement.classList.add("medium-rating");
      } else if (ratingPercent > 70 && ratingPercent <= 100) {
        ratingElement.classList.add("good-rating");
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
          ratingElement.classList.add("bad-rating");
        } else if (ratingPercent >= 50 && ratingPercent <= 70) {
          ratingElement.classList.add("medium-rating");
        } else if (ratingPercent > 70 && ratingPercent <= 100) {
          ratingElement.classList.add("good-rating");
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
      });
    })
    .catch((error) => console.error(error));
}

document
  .getElementById("searchBtn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const searchTerm = document.getElementById("searchInput").value.trim();

    if (searchTerm !== "") {
      searchMovies(searchTerm);
    }
  });
