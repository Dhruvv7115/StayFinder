import { useState } from "react";
import { Search, Filter } from "lucide-react"
function SearchBar({ setQuery }) {
  const [searchQuery, setSearchQuery] = useState("")
  const handleSearch = () => {
    setQuery({
      page: 1,
      limit: 20,
      query: searchQuery,
      sortBy: "price",
      sortType: "desc",
    });
  }
  return (
    <div className="md:flex hidden max-w-4xl mx-8 relative gap-2 items-center">
      <div className="flex items-center border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
        <div className="flex-1 px-4 py-6">
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Where are you going?"
            className="w-full outline-none text-sm"
          />
        </div>
        <div className="border-l border-gray-300 px-4 py-2">
          <input
            type="date"
            className="outline-none text-sm"
          />
        </div>
        <div className="border-l border-gray-300 px-4 py-2">
          <input
            type="date"
            className="outline-none text-sm"
          />
        </div>
        <div className="border-l border-gray-300 px-4 py-2">
          <select
            className="outline-none text-sm"
          >
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <option key={num} value={num}>{num} guest{num > 1 ? 's' : ''}</option>
            ))}
          </select>
        </div>
        <button
          className="bg-rose-500 text-white p-2 rounded-full ml-2 mr-2 hover:bg-rose-600 transition-colors"
          onClick={handleSearch}
        >
          <Search size={20} />
        </button>
      </div>
      
      <button
        className="mt-2 lg:flex hidden items-center space-x-2 text-sm text-gray-600 hover:text-gray-900"
      >
        <Filter size={20} />
        <span className="font-medium">Filters</span>
      </button>
      
      {/* {showFilters && <FilterPanel />} */}
    </div>
  )
}

export default SearchBar