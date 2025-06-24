import { MovieCard } from './MovieCard'

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

interface SearchResultsProps {
  movies: Movie[]
  onMoviePlay: (movie: Movie) => void
}

export function SearchResults({ movies, onMoviePlay }: SearchResultsProps) {
  return (
    <div className="pt-24 px-4 md:px-16 min-h-screen">
      <h2 className="text-white text-2xl md:text-3xl font-semibold mb-8">
        Search Results ({movies.length})
      </h2>
      
      {movies.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-gray-400 text-xl mb-4">
            No results found
          </div>
          <p className="text-gray-500">
            Try searching for a different title, genre, or keyword
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onMoviePlay}
            />
          ))}
        </div>
      )}
    </div>
  )
}
