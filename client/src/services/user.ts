import react from 'react';

export const fetchUserDetails = async (): Promise<{ username: string; userId: number }> => {
    const response = await fetch('/api/users/me', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
  
    if (!response.ok) {
      throw new Error('Failed to fetch user details');
    }
  
    return await response.json();
  };
  