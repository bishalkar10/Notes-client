import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Notes = lazy(() => import("./pages/Notes"));

function App() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
        <NotesProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <Navigate to="/notes" />
                  ) : (
                    <Navigate to="/login" />
                  )
                }
              />
              <Route
                path="/notes"
                element={isAuthenticated ? <Notes /> : <Navigate to="/login" />}
              />
              <Route
                path="/login"
                element={isAuthenticated ? <Navigate to="/notes" /> : <Login />}
              />
              <Route
                path="/register"
                element={isAuthenticated ? <Navigate to="/notes" /> : <Register />}
              />
            </Routes>
          </Suspense>
        </NotesProvider>
    </Router>
  );
}

export default App;
