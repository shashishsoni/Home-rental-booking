import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="relative max-w-md w-full">
      <div className="relative">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by category, location, or type..."
          className="w-full px-6 py-3 pl-12 bg-white/10 backdrop-blur-md rounded-full
            border border-white/20 text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
            transition-all duration-300"
        />
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      </div>
      <button
        type="submit"
        className="absolute right-2 top-1/2 transform -translate-y-1/2
          px-4 py-1.5 bg-gradient-to-r from-purple-500 to-pink-500
          text-white rounded-full text-sm font-medium
          hover:from-purple-600 hover:to-pink-600
          transition-all duration-300"
      >
        Search
      </button>
    </form>
  );
};

export default SearchBar; 