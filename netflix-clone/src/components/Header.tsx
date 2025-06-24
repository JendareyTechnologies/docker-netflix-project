import { useState, useEffect } from 'react'
import { Search, Bell, User, ChevronDown } from 'lucide-react'

interface HeaderProps {
  onSearch: (query: string) => void
  onSearchClose: () => void
}

export function Header({ onSearch, onSearchClose }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    onSearch(query)
  }

  const handleSearchToggle = () => {
    if (isSearchOpen && searchQuery) {
      setSearchQuery('')
      onSearchClose()
    }
    setIsSearchOpen(!isSearchOpen)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsSearchOpen(false)
      setSearchQuery('')
      onSearchClose()
    }
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-black' : 'bg-gradient-to-b from-black/80 to-transparent'
      }`}
    >
      <div className="flex items-center justify-between px-4 md:px-16 py-4">
        {/* Logo and Navigation */}
        <div className="flex items-center space-x-8">
          <div className="text-red-600 text-2xl font-bold">NETFLIX</div>
          
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-white hover:text-gray-300 transition-colors">
              Home
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              TV Shows
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              Movies
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              New & Popular
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition-colors">
              My List
            </a>
          </nav>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <span className="text-white">Browse</span>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="relative flex items-center">
            {isSearchOpen ? (
              <div className="flex items-center bg-black border border-white">
                <Search className="w-5 h-5 text-white ml-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyPress}
                  placeholder="Titles, people, genres"
                  className="bg-transparent text-white placeholder-gray-400 px-3 py-2 text-sm outline-none w-64"
                  autoFocus
                />
                <button
                  onClick={handleSearchToggle}
                  className="p-2 text-white hover:text-gray-300"
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                onClick={handleSearchToggle}
                className="p-2 text-white hover:text-gray-300 transition-colors"
              >
                <Search className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Notifications */}
          <button className="p-2 text-white hover:text-gray-300 transition-colors">
            <Bell className="w-5 h-5" />
          </button>

          {/* Profile */}
          <div className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-red-600 rounded flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <ChevronDown className="w-4 h-4 text-white" />
          </div>
        </div>
      </div>
    </header>
  )
}
