
interface LoginCredentials {
  email: string;
  password: string;
}

// Hardcoded credentials for demonstration purposes
const VALID_EMAIL = 'rickazoy@gmail.com';
const VALID_PASSWORD = '!$L3t5F1ngGo!$';

export const login = (credentials: LoginCredentials): boolean => {
  const { email, password } = credentials;
  
  // Check if credentials match
  if (email === VALID_EMAIL && password === VALID_PASSWORD) {
    // Store authentication state in localStorage
    localStorage.setItem('is_authenticated', 'true');
    localStorage.setItem('is_admin', 'true');
    return true;
  }
  
  return false;
};

export const isAuthenticated = (): boolean => {
  return localStorage.getItem('is_authenticated') === 'true';
};

export const logout = (): void => {
  localStorage.removeItem('is_authenticated');
  // Optionally remove admin status as well
  // localStorage.removeItem('is_admin');
};
