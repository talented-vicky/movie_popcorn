import { useState } from "react";
import PropTypes from "prop-types";

const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App() {
  const [movies, setMovies] = useState(tempMovieData);
  const [watched, setWatched] = useState(tempWatchedData);

  return (
    <>
      {/* <MovieNav movies={movies}></MovieNav> */}
      {/* MOVIE_NAVIGATION */}
      <MovieNav>
        <Logo></Logo>
        <Search></Search>
        <SearchResult movies={movies}></SearchResult>
      </MovieNav>
      
      {/* MOVIE_BODY */}
      <MovieBody >
        <MoviesBox>
          <MovieData movies={movies}></MovieData>
        </MoviesBox>
        
        <MoviesBox>
          <>
            <Summary watched={watched}></Summary>
            <WatchedData watched={watched}></WatchedData>
          </>
        </MoviesBox>
      </MovieBody>
    </>
  );
}


// movie_navigation
// ******
function MovieNav({children}) {
  return (
    <nav className="nav-bar">
        {children}
    </nav>
  )
}
// function MovieNav({movies}) {
//   return (
//     <nav className="nav-bar">
//         <Logo></Logo>
//         <Search></Search>
//         <SearchResult movies={movies}></SearchResult>
//     </nav>
//   )
// }

// movie_navigation_component
// ******
function Logo(){
  return (
    <div className="logo">
          <span role="img">🍭</span>
          <h1>moveie_pop</h1>
        </div>
  )
}
function Search() {
  const [query, setQuery] = useState("");
  return (
    <input
          className="search"
          type="text"
          placeholder="Search movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
  )
}
function SearchResult({movies}) {
  return (
    <p className="num-results">
      Showing <strong>{movies.length}</strong> results
    </p>
  )
}



// movie_body
// ******
function MovieBody({children}) {
  return (
    <main className="main">
      { children }
    </main>
  )
}

function MoviesBox({children}) {
  const [isOpen, setIsOpen] = useState(true)
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen((open) => !open)}
      >
      {isOpen ? "–" : "+"}
      </button>
      {isOpen && ( children )}
    </div>
  )
}
// movie_body_component
// ******
function MovieData({movies}) {
  return (
    <ul className="list">
      {movies?.map((movie) => (
        <MovieInfo movie={movie} key={movie.imdbID}></MovieInfo>
      ))}
    </ul>
  )
}
function MovieInfo({movie}) {
  return (
    <li>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
        <p>
          <span>🎭</span>
          <span>{movie.Year}</span>
        </p>
    </li>
  )
}
function Summary({watched}){
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
                <h2>Movies you watched</h2>
                <div>
                  <p>
                    <span>#️⃣</span>
                    <span>{watched.length} movies</span>
                  </p>
                  <p>
                    <span>⭐️</span>
                    <span>{avgImdbRating}</span>
                  </p>
                  <p>
                    <span>🌟</span>
                    <span>{avgUserRating}</span>
                  </p>
                  <p>
                    <span>⏳</span>
                    <span>{avgRuntime} min</span>
                  </p>
                </div>
              </div>
  )
}
function WatchedData({watched}){
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedInfo movie={movie} key={movie.imdbID}></WatchedInfo>
      ))}
    </ul>
  )
}
function WatchedInfo({movie}) {
  const [rating, setRating] = useState("");
  return (
    <li>
          <img src={movie.Poster} alt={`${movie.Title} poster`} />
          <h3>{movie.Title}</h3>
          <div>
            <p>
            <span>⭐️</span>
            <span>{movie.imdbRating}</span>
          </p>
            <p>
              <span>🌟</span>
              <span>{movie.userRating}</span>
            </p>
            <p>
              <span>⏳</span>
              <span>{movie.runtime} min</span>
            </p>
          </div>
          <div>
            {/* <Star setExtRating={setRating}></Star> */}
            <Star setExtRating={setRating}></Star>
            <p> you rated this a {rating === "" ? 0 : rating}</p>
            {/* <Star maxRate={7} initRate={4} noRateIcon={"🕳"} rateIcon={"💫"}></Star> */}
          </div>
        </li>
  )
}
const divBox = {
  display: "flex",
  alignItems: "center",
  gap: "12px"
}
const starBox = {
  display: "flex",
  gap: "3.5px"
}
const starStyle = {
  cursor: "pointer"
}


Star.propTypes = {
  maxRate: PropTypes.number,
  noRateIcon: PropTypes.string,
  setExtRating: PropTypes.func
}

function Star({ maxRate = 5, initRate = 2, noRateIcon="🤍", rateIcon="💖", setExtRating}) {
  const [rate, setRate] = useState(initRate)
  const [tempRate, setTempRate] = useState("")
  
  return (
    <div style={divBox}>
      <div style={starBox}>
        {Array.from({length: maxRate}, (_, ind) => (
          <span style={starStyle} 
            onMouseEnter={() => setTempRate(ind + 1)}
            onMouseLeave={() => setTempRate(0)}
            onClick={() => {
              setRate(ind + 1)
              setExtRating(ind + 1)
            }}
            > {tempRate 
              ? (tempRate >= ind + 1 ? rateIcon  : noRateIcon)
              : (rate >= ind + 1 ? rateIcon  : noRateIcon)
            }
          </span>
        ))}
      </div>
      <p> {tempRate || rate || ""}</p>
    </div>
  ) 
}