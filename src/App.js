import { useEffect, useState } from "react";
import PropTypes from "prop-types";

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

const api_key = "406a40fb";

export default function App() {
  const [movies, setMovies] = useState([]);
  // const [watched, setWatched] = useState(tempWatchedData);
  const [watched, setWatched] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState("");
  const [query, setQuery] = useState("");
  const [movieId, setMovieId] = useState(null)

  function handleMovieId (id) {
    setMovieId(selectedId => selectedId === id ? null : id)
  }

  function handleCloseMovie(){
    setMovieId(null)
  }

  function handleAddWatched(movie) {
    const AddedMov = watched.find(mov => mov.imdbID === movie.imdbID)
    if(AddedMov){
      console.log("Movie already added to watched list")
      return
    }
    setWatched(watched => [...watched, movie])
    setMovieId(null)
  }

  // render logic is basically what gets called when a component first mounts
  // hence you should never set state in render logic (infinite request loop)
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setErr("") // ensuring I clean up previously displayed error from the UI

        const data = await fetch(`http://www.omdbapi.com/?apikey=${api_key}&s=${query}`)
        if(!data.ok){
          throw new Error("Network Error")
        }

        const jsonData = await data.json()
        if(jsonData.Response === "False"){
          // throw new Error("Movie Not Found")
          throw new Error(jsonData.Error) // passing actual msg rather than hard coded error
        }

        setMovies(jsonData.Search)
      } catch (newErr) {
        console.error(newErr.message) 
        // this is me catching whatever error string I previously threw
        setErr(newErr.message)
      } finally {
        setIsLoading(false)
      }
    }

    if(query.length < 3){
      setMovies([])
      setErr("")
      return
    }
     
    fetchData()
   }, [query]) // runs when there's an update on array value ("query" in this case)
  // }, []) // runs only on mount
  // }) // runs on every render (not a good practice)

  // asides using "event handlers", another way to use a side effect (an interaction 
  // btwn a component and real world data, it should never be placed in a 
  // render logic tho) is via "useEffect", which helps register it after it has 
  // been painted on the screen and is used when we want to load data 
  // immediately a component mounts -- the array argument ensures this
  

  return (
    <>
      {/* <MovieNav movies={movies}></MovieNav> */}
      {/* MOVIE_NAVIGATION */}
      <MovieNav>
        <Logo></Logo>
        <Search query={query} setQuery={setQuery}></Search>
        <SearchResult movies={movies}></SearchResult>
      </MovieNav>
      
      {/* MOVIE_BODY */}
      <MovieBody >
        <MoviesBox>
          { isLoading && <LoadingData></LoadingData> }
          {  err && <ErrorPage msg={err}></ErrorPage> }
          { !isLoading && !err && <MovieData movies={movies} onMovieId={handleMovieId}></MovieData>}
        </MoviesBox>
        
        <MoviesBox>
          { movieId 
          ? <MovieDetails id={movieId} 
              onCloseMovie={handleCloseMovie}
              onAddWatched={handleAddWatched}
            >
            </MovieDetails>
          :
            <>
              <Summary watched={watched}></Summary>
              {/* <ReadMore></ReadMore> */}
              <WatchedData watched={watched}></WatchedData>
            </>
          }
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
function Search({query, setQuery}) {
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
function MovieData({movies, onMovieId}) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <MovieInfo movie={movie} key={movie.imdbID} onMovieId={onMovieId}></MovieInfo>
      ))}
    </ul>
  )
}
function LoadingData(){
  return (
    <p className="loader">Loading...</p>
  )
}
function ErrorPage({msg}) {
  return <div className="error">
    <span> {msg} </span>
  </div>
}
function MovieDetails({id, onCloseMovie, onAddWatched}) {
  const [movie, setMovie] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const { Title, Genre, Plot, Poster, Released, 
    Runtime, imdbRating, Actors, Director } = movie

  useEffect(() => {
    const LoadMovieDetails = async () => {
      try {
        setIsLoading(true)
        const data = await fetch(`http://www.omdbapi.com/?apikey=${api_key}&i=${id}`)
        if(!data.ok){
          throw new Error("Network Error!")
        }     
        
        const jsonData = await data.json()
        setMovie(jsonData)
        
      } catch (error) {
        console.error(error)
      } finally {
        setIsLoading(false)
      }
    }

    LoadMovieDetails()
  }, [id]) 

  return (
    <div className="details">
      {
        isLoading ? <LoadingData></LoadingData>
        :
        <>
          <header>
            <button className="btn-back" onClick={onCloseMovie}> ⬅</button>
            <img src={Poster} alt={Title}></img>
            <div className="details-overview">
              <h2> {Title} </h2>
              <p> {Released} ▫ {Runtime}</p>
              <p> {Genre} </p>
              <p> {imdbRating}⭐ IMDB Rating`</p>
            </div>
          </header>

          <section>
            <div className="rating">
              <Star initRate={0} maxRate={10} setExtRating={() => {}}></Star>
              <button onClick={() => onAddWatched(movie)}> ➕ Add to List </button>
            </div>
            <p> {Plot} </p>
            <p> Actors: {Actors}</p>
            <p> Directed by: {Director} </p>
          </section>
        </>
      }
    </div>
  )
}
function MovieInfo({movie, onMovieId}) {
  return (
    <li onClick={() => onMovieId(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`}/>
      <h3>{movie.Title}</h3>
        <p>
          <span>🎭</span>
          <span>{movie.Year}</span>
        </p>
    </li>
  )
}
function Summary({watched}){
  const avgImdbRating = average(watched.map((movie) => Number(movie.imdbRating)));
  const avgUserRating = average(watched.map((movie) => Number(movie.userRating)));
  const avgRuntime = average(watched.map((movie) => movie.Runtime.split(" ").at(0)));
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
  // const [rating, setRating] = useState("");
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
              <span>{movie.Runtime}</span>
            </p>
          </div>
          <div>
            {/* <Star setExtRating={setRating}></Star>
            <p> you rated this a {rating === "" ? 0 : rating}</p> */}
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

function Star({ maxRate = 5, initRate = 2, noRateIcon="🤍", rateIcon="💖", setExtRating={}}) {
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

// function ReadMore() {
//   return (
//     <div>
//       <ExpandingText
//         collapsedNumWords={20}
//         expandButtonText="Show more"
//         collapseButtonText="Read Less"
//         buttonColor="#ffff"
//       >
//         Space travel requires some seriously amazing technology and
//         collaboration between countries, private companies, and international
//         space organizations. And while it's not always easy (or cheap), the
//         results are out of this world. Think about the first time humans stepped
//         foot on the moon or when rovers were sent to roam around on Mars.
//       </ExpandingText>
//       <ExpandingText
//         collapsedNumWords={10}
//         expandButtonText="More"
//         collapseButtonText="Less"
//         buttonColor="#ff6622"
//       >
//         Space travel is the ultimate adventure! Imagine soaring past the stars
//         and exploring new worlds. It's the stuff of dreams and science fiction,
//         but believe it or not, space travel is a real thing. Humans and robots
//         are constantly venturing out into the cosmos to uncover its secrets and
//         push the boundaries of what's possible.
//       </ExpandingText>

//       <ExpandingText 
//         expanded={true} className="box"
//       >
//         Space missions have given us incredible insights into our universe and
//         have inspired future generations to keep reaching for the stars. Space
//         travel is a pretty cool thing to think about. Who knows what we'll
//         discover next!
//       </ExpandingText>
//     </div>
//   )
// }


// function ExpandingText({collapsedNumWords, expandButtonText, collapseButtonText, buttonColor, expanded, children}) {
//   const [exp, setExp] = useState(true)
//   const [text, setText] = useState(children)

//   const btnStyle = {
//     color: buttonColor,
//     background: "none",
//     border: "none",
//     fontSize: "10px",
//     cursor: "pointer",
//     marginLeft: "3px"
//   }

//   function altTextContent(wholeText, limit) {
//     if(exp) {
//       const shortened = wholeText.split(" ").slice(0, limit).join(" ") + "..."
//       setText(shortened);
//     } else {
//       setText(children)
//     }
//   }

//   function toggleBtn () {
//     setExp(!exp)
//   }
  
//   useEffect(() => {
//     altTextContent(children, collapsedNumWords)
//   })

//   return (    
//     <div >  
//       <span> {expanded ? children : text } </span>
//       <button style={btnStyle} onClick={() => {
//         altTextContent(children, collapsedNumWords)
//         toggleBtn()
//       }}> {exp ? expandButtonText : collapseButtonText} 
//       </button>
//     </div>
//   )
// }