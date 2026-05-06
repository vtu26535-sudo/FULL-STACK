import { jwtDecode } from 'jwt-decode';

export const getAuthUser = () => {
  const token = localStorage.getItem('token');
  if (!token) return null;
  
  try {
    const decoded = jwtDecode(token);
    // Spring Security roles are often mapped. Check if it's ROLE_ADMIN
    return decoded;
  } catch (error) {
    console.error("Invalid token:", error);
    return null;
  }
};

export const isAdmin = () => {
  const user = getAuthUser();
  if (!user) return false;
  // Based on standard Spring setup or custom payload
  return user.role === 'ADMIN' || user.role === 'ROLE_ADMIN' || user.roles?.includes('ROLE_ADMIN') || user.sub === 'admin@eventhub.com';
};

export const logout = () => {
  localStorage.removeItem('token');
  window.location.href = '/login';
};
