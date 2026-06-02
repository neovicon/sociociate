import { useAuth } from '../context/AuthContext';

// Returns true when the user is authenticated and loading is complete.
// The component can use this to render a <Navigate> element.
const useRedirectIfAuthenticated = () => {
  const { user, loading } = useAuth();
  return !loading && !!user;
};

export default useRedirectIfAuthenticated;
