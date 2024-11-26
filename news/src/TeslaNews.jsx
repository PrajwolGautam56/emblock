// src/TeslaNews.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TeslaNews = () => {
  const [news, setNews] = useState([]);
  const [filteredNews, setFilteredNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedSource, setSelectedSource] = useState('');
  const [selectedDate, setSelectedDate] = useState('all-time');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // Updated sources list with actual news sources
  const sources = ['All', 'Reuters', 'Bloomberg', 'CNBC', 'TechCrunch', 'The Verge'];
  const dateFilters = [
    { value: 'all-time', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: '7-days', label: 'Last 7 Days' },
    { value: '30-days', label: 'Last 30 Days' }
  ];

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/tesla-news', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).sub : ''}`
          }
        });
        setNews(response.data.articles);
        setFilteredNews(response.data.articles);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch news. Please try again later.');
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  // Enhanced keyword filter with multiple fields
  const filterByKeyword = (newsList, keyword) => {
    if (!keyword.trim()) return newsList;
    const searchTerms = keyword.toLowerCase().split(' ');
    
    return newsList.filter(article => {
      const searchableText = `
        ${article.title || ''} 
        ${article.description || ''} 
        ${article.content || ''} 
        ${article.author || ''} 
        ${article.source.name || ''}
      `.toLowerCase();
      
      return searchTerms.every(term => searchableText.includes(term));
    });
  };

  // Enhanced date filter with 30 days option
  const filterByDate = (newsList, dateFilter) => {
    const now = new Date();
    let dateCondition = new Date();

    switch (dateFilter) {
      case 'today':
        dateCondition.setHours(0, 0, 0, 0);
        break;
      case '7-days':
        dateCondition.setDate(now.getDate() - 7);
        break;
      case '30-days':
        dateCondition.setDate(now.getDate() - 30);
        break;
      default:
        return newsList;
    }

    return newsList.filter(article => {
      const articleDate = new Date(article.publishedAt);
      return articleDate >= dateCondition;
    });
  };

  // Function to filter news by source
  const filterBySource = (newsList, source) => {
    if (!source || source === 'All') return newsList;
    return newsList.filter((article) => article.source.name === source);
  };

  // Apply all filters
  useEffect(() => {
    let filtered = filterByKeyword(news, searchKeyword);
    filtered = filterByDate(filtered, selectedDate);
    filtered = filterBySource(filtered, selectedSource);
    setFilteredNews(filtered);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchKeyword, selectedSource, selectedDate, news]);

  // Page Information for Pagination 
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredNews.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredNews.length / itemsPerPage);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 p-4">
        <h2 className="text-xl font-bold mb-2">Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by title, description, source..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
          >
            {sources.map((source, index) => (
              <option key={index} value={source}>{source}</option>
            ))}
          </select>

          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 min-w-[150px]"
          >
            {dateFilters.map((filter, index) => (
              <option key={index} value={filter.value}>
                {filter.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* Results count */}
        <div className="mt-4 text-gray-600">
          Found {filteredNews.length} results
        </div>
      </div>

      {/* News Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((article, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-[650px]">
            <div className="w-[350px] h-[400px] relative mx-auto">
              <img
                src={article.urlToImage || 'https://via.placeholder.com/350x400?text=No+Image'}
                alt={article.title}
                className="w-[350px] h-[400px] object-cover"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/350x400?text=No+Image';
                }}
              />
            </div>
            <div className="p-4 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold mb-2 line-clamp-2">{article.title}</h2>
              <p className="text-gray-600 text-sm mb-2">
                {article.source.name} • {new Date(article.publishedAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 line-clamp-3 flex-1">{article.description}</p>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-block text-blue-600 hover:text-blue-800 font-medium"
              >
                Read more →
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8 gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 hover:bg-gray-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default TeslaNews;
