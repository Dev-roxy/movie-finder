const searchInput = document.getElementById("search");
const cardGrid = document.querySelector(".cardGrid");
const url = `/getMovies?&s=`;
let timeoutId = null;
let totalResults = 0;
let page = 1;

const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateCard = async ({ src, name, year, type }) => {
  return `<div class="card">
        <div class="poster">
            <img src="${src === "N/A" ? "/images/defaultMovie.png" : src}"
                alt="${name}">
               <h3 class="type">${capitalize(type)}</h3>  
        </div>
        <div class="info">
        <div class="toolTip"><h2>${name}</h2></div>
            <h2>${name}</h2>
            <h3>${year}</h3>
        </div>
        
    </div>`;
};

const getRandomMovie = () => {
  const defaultMoviesName = [
    "batman",
    "superman",
    "Marvel",
    "Doctor",
    "girl",
    "Avengers",
    "Spider man",
    "Hulk",
    "Iron man",
    "Thor",
  ];
  const randomIndex = Math.floor(Math.random() * defaultMoviesName.length);
  const randomMovie = defaultMoviesName[randomIndex];
  return randomMovie;
};

const generateNotFound = () => {
  return ` <div class="notFound">
            <div class="errorEmoji">(&gt;_&lt;)</div>
            <div>
              <p>No movies found</p>
            </div>
          </div>`;
};

const generateLoading = () => {
  return `<div class="loading">
        <div class="load">
            <div class="innerLoad"></div>
        </div>
    </div>`;
};

const getMovies = async (search, page = 1) => {
  const response = await fetch(`${url}${search}&p=${page}`);
  const data = await response.json();
  if (data.Response === "True") {
    totalResults = data.totalResults;
    return data.Search;
  } else {
    return [];
  }
};

const handleSearch = (e) => {
  if (timeoutId) {
    clearTimeout(timeoutId);
  }

  timeoutId = setTimeout(async () => {
    page = 1;

    const search = e.target.value.toString().trim() ? e.target.value.toString().trim() : getRandomMovie();

    if (
      document
        .querySelector("main")
        .lastElementChild.classList.contains("notFound") ||
      document
        .querySelector("main")
        .lastElementChild.classList.contains("loading")
    ) {
      document
        .querySelector("main")
        .removeChild(document.querySelector("main").lastElementChild);
      if (
        document
          .querySelector("main")
          .lastElementChild.classList.contains("notFound") ||
        document
          .querySelector("main")
          .lastElementChild.classList.contains("loading")
      ) {
        document
          .querySelector("main")
          .removeChild(document.querySelector("main").lastElementChild);
      }
    }

    document.querySelector("main").innerHTML += generateLoading();
    const movies = (await getMovies(search, page)) || [];
    document
      .querySelector("main")
      .removeChild(document.querySelector("main").lastElementChild);

    if (movies.length === 0) {
      document.querySelector(".cardGrid").innerHTML = "";
      document.querySelector("main").innerHTML += generateNotFound();
    } else {
      document.querySelector(".cardGrid").innerHTML = "";
      movies.forEach(async (movie) => {
        const card = await generateCard({
          src: movie.Poster,
          name: movie.Title,
          year: movie.Year,
          type: movie.Type,
        });
        document.querySelector(".cardGrid").innerHTML += card;
      });
      page++;
    }
  }, 500);
};

const handleDocumentLoaded = async () => {
  setTimeout(() => {
    searchInput.value = ""; //
  }, 100);
  document.querySelector("main").innerHTML += generateLoading();
  const movie = getRandomMovie();
  const movies = await getMovies(movie, page) || [];
  document.querySelector(".cardGrid").innerHTML = "";

  movies.forEach(async (movie) => {
    const card = await generateCard({
      src: movie.Poster,
      name: movie.Title,
      year: movie.Year,
      type: movie.Type,
    });
    document.querySelector(".cardGrid").innerHTML += card;
  });
  document
    .querySelector("main")
    .removeChild(document.querySelector("main").lastElementChild);
  page++;
};

const handelScroll = async () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    if (totalResults > document.querySelectorAll(".card").length) {
      if (
        !document
          .querySelector("main")
          .lastElementChild.classList.contains("loading")
      ) {
        document.querySelector("main").innerHTML += generateLoading();

        const searchQuery = searchInput.value || getRandomMovie();
        const movies = (await getMovies(searchQuery, page)) || [];

        document
          .querySelector("main")
          .removeChild(document.querySelector("main").lastElementChild);

        if (movies.length !== 0) {
          movies.forEach(async (movie) => {
            const card = await generateCard({
              src: movie.Poster,
              name: movie.Title,
              year: movie.Year,
              type: movie.Type,
            });
            document.querySelector(".cardGrid").innerHTML += card;
          });
        }

        if (document.querySelector("#search").value !== "") {
          page++;
        }
      }
    }
  }
};

document.addEventListener("DOMContentLoaded", handleDocumentLoaded);
document.addEventListener("input", (e) => {
  if (e.target.id === "search") {
    handleSearch(e);
  }
});
window.addEventListener("scroll", handelScroll);
