"use client"; 
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; 
import GlobalApi from '@/app/_utils/GlobalApi'; 

const Profile = () => {
  const router = useRouter(); 
  const jwt = sessionStorage.getItem('jwt');
  const [userData, setUserData] = useState(null);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!jwt) {
      router.replace('/'); 
      return; 
    }

    const getUser = async () => {
      try {
        const fetchedUserData = await GlobalApi.getUser(jwt); 
        setUserData(fetchedUserData); 
        setUsername(fetchedUserData.username); 
        setEmail(fetchedUserData.email); 
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    getUser(); 
  }, [jwt, router]); 

  const handleUpdateUser = async (e) => {
    e.preventDefault(); 
    setIsLoading(true); 
    setError(''); 

    try {
      await GlobalApi.updateUser({ username, email, password }, jwt); 
      alert("Profile updated successfully!"); 
    } catch (error) {
      setError("Error updating user data: " + error.message); 
    } finally {
      setIsLoading(false); 
    }
  };

  return (
    <div>
      <h2 className="p-3 bg-primary text-3xl font-bold text-center text-white mb-3">
        Profile
      </h2>
      <div className="container mx-auto px-4 flex items-center">
        <div>
          <h2 className="p-3 text-md font-semibold text-primary mb-3">Manage your Profile</h2>
          {userData ? (
            <>
              <div className="mb-4 flex justify-center">
                <img 
                  src={userData.icon} 
                  alt={username}
                  className="rounded-full w-24 h-24 object-cover border-2 border-primary" 
                />
              </div>

              <form onSubmit={handleUpdateUser}>
                <div className="mb-4">
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg" 
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg" 
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="mt-1 block w-full p-3 border border-gray-300 rounded-lg" 
                    placeholder="Enter new password"
                  />
                </div>
                {error && <p className="text-red-600">{error}</p>}
                <button
                  type="submit"
                  className={`mt-2 bg-primary text-white p-2 rounded ${isLoading ? "opacity-50" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Updating..." : "Update Profile"}
                </button>
              </form>
            </>
          ) : (
            <p>Loading user data...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
