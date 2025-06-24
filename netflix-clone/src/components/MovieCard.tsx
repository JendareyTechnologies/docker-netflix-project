import { useState } from 'react'
import { Play, Plus, ThumbsUp, ChevronDown } from 'lucide-react'

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

interface MovieCardProps {
  movie: Movie
  onPlay: (movie: Movie) => void
}

export function MovieCard({ movie, onPlay }: MovieCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handlePlay = () => {
    onPlay(movie)
  }

  return (
    <div
      className="relative min-w-[240px] md:min-w-[300px] transition-all duration-300 cursor-pointer group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Movie Poster */}
      <div className="relative overflow-hidden rounded-md">
        <img
          src={movie.image}
          alt={movie.title}
          className={`w-full h-36 md:h-44 object-cover transition-all duration-300 ${
            isHovered ? 'scale-110' : 'scale-100'
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // Fallback to a placeholder if image fails to load
            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjE4MCIgdmlld0JveD0iMCAwIDMwMCAxODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIzMDAiIGhlaWdodD0iMTgwIiBmaWxsPSIjMzMzIi8+Cjx0ZXh0IHg9IjE1MCIgeT0iOTAiIGZpbGw9IiM2NjYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGFsaWdubWVudC1iYXNlbGluZT0ibWlkZGxlIiBmb250LWZhbWlseT0ic2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNiI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg=='
          }}
        />
        
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-800 animate-pulse flex items-center justify-center">
            <div className="text-gray-600">Loading...</div>
          </div>
        )}

        {/* Hover Overlay */}
        {isHovered && (
          <div className="absolute inset-0 bg-black/20 transition-opacity duration-300" />
        )}
      </div>

      {/* Expanded Card on Hover */}
      {isHovered && (
        <div className="absolute top-0 left-0 right-0 z-20 bg-zinc-900 rounded-md shadow-2xl transform scale-110 transition-all duration-300">
          {/* Video Preview */}
          <div className="relative">
            <video
              autoPlay
              muted
              loop
              className="w-full h-36 md:h-44 object-cover rounded-t-md"
            >
              <source src={movie.trailerUrl} type="video/mp4" />
              <img src={movie.image} alt={movie.title} className="w-full h-full object-cover" />
            </video>
            
            {/* Play Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/20">
              <button
                onClick={handlePlay}
                className="bg-white/90 hover:bg-white rounded-full p-2 transition-colors"
              >
                <Play className="w-6 h-6 text-black fill-current" />
              </button>
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Action Buttons */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <button
                  onClick={handlePlay}
                  className="bg-white hover:bg-gray-200 text-black rounded-full p-2 transition-colors"
                >
                  <Play className="w-4 h-4 fill-current" />
                </button>
                <button className="border-2 border-gray-400 hover:border-white text-white rounded-full p-2 transition-colors">
                  <Plus className="w-4 h-4" />
                </button>
                <button className="border-2 border-gray-400 hover:border-white text-white rounded-full p-2 transition-colors">
                  <ThumbsUp className="w-4 h-4" />
                </button>
              </div>
              <button className="border-2 border-gray-400 hover:border-white text-white rounded-full p-2 transition-colors">
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Movie Info */}
            <div className="space-y-2">
              <h3 className="text-white font-semibold text-sm">{movie.title}</h3>
              
              <div className="flex items-center space-x-2 text-xs">
                <span className="text-green-400 font-semibold">{movie.rating}</span>
                <span className="text-gray-300">{movie.year}</span>
                <span className="text-gray-300">{movie.duration}</span>
              </div>

              <div className="flex flex-wrap gap-1">
                {movie.genre.split(' ').map((genre, index) => (
                  <span
                    key={index}
                    className="text-gray-300 text-xs"
                  >
                    {genre}
                    {index < movie.genre.split(' ').length - 1 && ' •'}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
