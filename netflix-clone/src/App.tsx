import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { HeroSection } from './components/HeroSection'
import { ContentRow } from './components/ContentRow'
import { VideoModal } from './components/VideoModal'
import { SearchResults } from './components/SearchResults'
import './App.css'

interface Movie {
  id: number
  title: string
  description: string
  image: string
  genre: string
  rating: string
  year: number
  duration: string
  trailerUrl: string
  type: 'movie' | 'series'
}

interface MovieData {
  trending: Movie[]
  popular: Movie[]
  newReleases: Movie[]
  actionMovies: Movie[]
  comedyShows: Movie[]
  hero: Movie & { backgroundImage: string }
}

function App() {
  const [movieData, setMovieData] = useState<MovieData | null>(null)
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null)
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchActive, setIsSearchActive] = useState(false)

  useEffect(() => {
    fetch('/data/movies.json')
      .then(response => response.json())
      .then(data => setMovieData(data))
      .catch(error => console.error('Error loading movie data:', error))
  }, [])

  const allMovies = movieData ? [
    ...movieData.trending,
    ...movieData.popular,
    ...movieData.newReleases,
    ...movieData.actionMovies,
    ...movieData.comedyShows
  ] : []

  const filteredMovies = allMovies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleMoviePlay = (movie: Movie) => {
    setSelectedMovie(movie)
    setIsVideoModalOpen(true)
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    setIsSearchActive(query.length > 0)
  }

  const handleSearchClose = () => {
    setSearchQuery('')
    setIsSearchActive(false)
  }

  if (!movieData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl">Loading Netflix...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header onSearch={handleSearch} onSearchClose={handleSearchClose} />
      
      {isSearchActive ? (
        <SearchResults movies={filteredMovies} onMoviePlay={handleMoviePlay} />
      ) : (
        <>
          <HeroSection hero={movieData.hero} onPlay={handleMoviePlay} />
          
          <div className="relative z-10 -mt-32 space-y-8 pb-20">
            <ContentRow
              title="Trending Now"
              movies={movieData.trending}
              onMoviePlay={handleMoviePlay}
            />
            <ContentRow
              title="Popular on Netflix"
              movies={movieData.popular}
              onMoviePlay={handleMoviePlay}
            />
            <ContentRow
              title="New Releases"
              movies={movieData.newReleases}
              onMoviePlay={handleMoviePlay}
            />
            <ContentRow
              title="Action Movies"
              movies={movieData.actionMovies}
              onMoviePlay={handleMoviePlay}
            />
            <ContentRow
              title="Comedy Shows"
              movies={movieData.comedyShows}
              onMoviePlay={handleMoviePlay}
            />
          </div>
        </>
      )}

      <VideoModal
        movie={selectedMovie}
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
      />
    </div>
  )
}

export default App
