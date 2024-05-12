import { useState } from "react";

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
  const [isOpen1, setIsOpen1] = useState(true);
  const [isOpen2, setIsOpen2] = useState(true);

  return (
    <>
      <MovieNav movies={movies}></MovieNav>
      <MovieBody 
        movies={movies}
        watched={watched}
        isOpen1={isOpen1} 
        isOpen2={isOpen2}
        setIsOpen1={setIsOpen1}
        setIsOpen2={setIsOpen2}
      >
      </MovieBody>
    </>
  );
}


function MovieNav({movies}) {
  return (
    <nav className="nav-bar">
        <Logo></Logo>
        <Search></Search>
        <SearchResult movies={movies}></SearchResult>
    </nav>
  )
}

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



function MovieBody({movies, watched, isOpen1, isOpen2, setIsOpen1, setIsOpen2}) {
  return (
    <main className="main">
      <ListMovies movies={movies} isOpen1={isOpen1} setIsOpen1={setIsOpen1}></ListMovies>  
      <WatchedMovies watched={watched} isOpen2={isOpen2} setIsOpen2={setIsOpen2}></WatchedMovies>
    </main>
  )
}

function ListMovies({movies, isOpen1, setIsOpen1}) {
  return (
    <div className="box">
      <button
        className="btn-toggle"
        onClick={() => setIsOpen1((open) => !open)}
      >
      {isOpen1 ? "–" : "+"}
      </button>
      {isOpen1 && (
        <MovieData movies={movies}></MovieData>
      )}
    </div>
  )
}
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


function WatchedMovies({watched, isOpen2, setIsOpen2}) {
  return (
    <div className="box">
          <button
            className="btn-toggle"
            onClick={() => setIsOpen2((open) => !open)}
          >
            {isOpen2 ? "–" : "+"}
          </button>
          {isOpen2 && (
            <>
              <Summary watched={watched}></Summary>
              <WatchedData watched={watched}></WatchedData>
            </>
          )}
        </div>
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
        </li>
  )
}
// function Span({movie, chil}){
//   return (
//     <p>
//       <span>⭐️</span>
//       <span>{movie.imdbRating}</span>
//     </p>
//   )
// }