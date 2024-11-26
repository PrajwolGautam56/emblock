// src/App.js
import React, { useState, useEffect } from 'react';
import TeslaNews from './TeslaNews.jsx';
import Auth from './components/Auth.jsx';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
     const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-6 px-4">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Tesla News Portal</h1>
            <Auth 
              user={user}
              onLogin={handleLogin}
              onLogout={handleLogout}
            />
          </div>
        </div>
      </header>
      <main className="container mx-auto py-8">
        {user ? (
          <TeslaNews />
        ) : (
          <div className="text-center py-20">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">
              Welcome to Tesla News Portal
            </h2>
            <p className="text-gray-600 mb-8">
              Please sign in with Google to access the latest Tesla news
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
