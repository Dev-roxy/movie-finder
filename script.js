const searchInput = document.getElementById("search");
const url = `http://www.omdbapi.com/?plot=full&apikey=${API_KEY}&s=`;
let timeoutId = null;

const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};

const generateCard = async ({ src, name, year ,type}) => {
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
    ]
    const randomIndex = Math.floor(Math.random() * defaultMoviesName.length);
    const randomMovie = defaultMoviesName[randomIndex];
    return randomMovie;
}

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

const getMovies = async (search) => {
    const response = await fetch(url + search);
    if (response.ok) {
        const data = await response.json();
        return data.Search;
    }else{
        return [];
    }
};


document.addEventListener("DOMContentLoaded", async () => {
  searchInput.value = "";
    document.querySelector(".cardGrid").innerHTML = generateLoading();
    const movie = getRandomMovie();
    const movies = await getMovies(movie);
    document.querySelector(".cardGrid").innerHTML = "";

    movies.forEach(async (movie) => {
        const card = await generateCard({
            src: movie.Poster,
            name: movie.Title,
            year: movie.Year,
            type: movie.Type
        });
        document.querySelector(".cardGrid").innerHTML += card;
    });
});


searchInput.addEventListener("input",(e) => {
    if (timeoutId) {
     clearTimeout(timeoutId);
    };
    timeoutId = setTimeout(async()=>{
     const search = e.target.value || getRandomMovie();
     document.querySelector(".cardGrid").innerHTML = generateLoading();
     const movies = await getMovies(search) || [];
     console.log(movies);
     if(movies.length === 0){
         document.querySelector(".cardGrid").innerHTML = generateNotFound();
     }else{
       document.querySelector(".cardGrid").innerHTML = "";
       movies.forEach(async (movie) => {
           const card = await generateCard({
               src: movie.Poster,
               name: movie.Title,
               year: movie.Year,
                type: movie.Type
           });
           document.querySelector(".cardGrid").innerHTML += card;
       });
     }
    
    },500)
   
 });
