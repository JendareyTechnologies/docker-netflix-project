import { useState, useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
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

interface ContentRowProps {
  title: string
  movies: Movie[]
  onMoviePlay: (movie: Movie) => void
}

export function ContentRow({ title, movies, onMoviePlay }: ContentRowProps) {
  const [scrollPosition, setScrollPosition] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return

    const container = containerRef.current
    const scrollAmount = container.clientWidth * 0.8
    const maxScroll = container.scrollWidth - container.clientWidth

    let newPosition
    if (direction === 'left') {
      newPosition = Math.max(0, scrollPosition - scrollAmount)
    } else {
      newPosition = Math.min(maxScroll, scrollPosition + scrollAmount)
    }

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    })
    setScrollPosition(newPosition)
  }

  const canScrollLeft = scrollPosition > 0
  const canScrollRight = containerRef.current 
    ? scrollPosition < containerRef.current.scrollWidth - containerRef.current.clientWidth
    : true

  return (
    <div className="px-4 md:px-16 mb-8">
      <h2 className="text-white text-xl md:text-2xl font-semibold mb-4">
        {title}
      </h2>
      
      <div className="relative group">
        {/* Left Arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-r from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Right Arrow */}
        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-0 bottom-0 z-10 w-12 bg-gradient-to-l from-black/80 to-transparent flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight className="w-8 h-8 text-white" />
          </button>
        )}

        {/* Movies Container */}
        <div
          ref={containerRef}
          className="flex space-x-2 overflow-x-hidden scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onMoviePlay}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
