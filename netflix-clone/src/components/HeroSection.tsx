import { useState, useEffect } from 'react'
import { Play, Info, VolumeX, Volume2 } from 'lucide-react'

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

interface HeroProps {
  hero: Movie & { backgroundImage: string }
  onPlay: (movie: Movie) => void
}

export function HeroSection({ hero, onPlay }: HeroProps) {
  const [isMuted, setIsMuted] = useState(true)
  const [isVideoLoaded, setIsVideoLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVideoLoaded(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const handlePlay = () => {
    onPlay(hero)
  }

  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  return (
    <div className="relative h-screen overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${hero.backgroundImage})`,
        }}
      >
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
      </div>

      {/* Background Video (Autoplay simulation) */}
      {isVideoLoaded && (
        <div className="absolute inset-0">
          <video
            autoPlay
            muted={isMuted}
            loop
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.7)' }}
          >
            <source src={hero.trailerUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="absolute inset-0 flex items-center">
        <div className="px-4 md:px-16 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {hero.title}
          </h1>
          
          <div className="flex items-center space-x-4 mb-4">
            <span className="text-green-400 font-semibold">{hero.rating}</span>
            <span className="text-white">{hero.year}</span>
            <span className="text-white">{hero.duration}</span>
            <span className="px-2 py-1 bg-gray-600 text-white text-xs rounded">
              {hero.genre}
            </span>
          </div>

          <p className="text-lg md:text-xl text-white mb-8 leading-relaxed drop-shadow-lg max-w-xl">
            {hero.description}
          </p>

          <div className="flex items-center space-x-4">
            <button
              onClick={handlePlay}
              className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded font-semibold hover:bg-gray-200 transition-colors"
            >
              <Play className="w-5 h-5 fill-current" />
              <span>Play</span>
            </button>

            <button className="flex items-center space-x-2 bg-gray-600/80 text-white px-8 py-3 rounded font-semibold hover:bg-gray-600 transition-colors">
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mute/Unmute Button */}
      {isVideoLoaded && (
        <button
          onClick={toggleMute}
          className="absolute bottom-24 right-8 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-colors"
        >
          {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
        </button>
      )}

      {/* Age Rating Badge */}
      <div className="absolute bottom-24 left-4 md:left-16">
        <div className="bg-gray-800 text-white px-3 py-1 rounded text-sm font-semibold">
          {hero.rating}
        </div>
      </div>
    </div>
  )
}
