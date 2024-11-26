import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Auth = ({ onLogin, onLogout, user }) => {
  const handleSuccess = (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential);
      onLogin(decoded);
      localStorage.setItem('user', JSON.stringify(decoded));
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleError = () => {
    console.error('Login Failed');
  };

  const handleLogout = () => {
    try {
      onLogout();
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {user ? (
        <div className="flex items-center gap-4">
          <img
            src={user.picture}
            alt={user.name}
            className="w-8 h-8 rounded-full"
          />
          <span className="text-gray-700">{user.name}</span>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
          >
            Logout
          </button>
        </div>
      ) : (
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={handleError}
          useOneTap
        />
      )}
    </div>
  );
};

export default Auth; 