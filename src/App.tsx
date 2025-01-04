import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { api } from "./services/api";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Notes from "./pages/Notes";
import Loader from "./components/Loader";
import useApi from './hooks/useApi';
import { useAuth } from "./context/AuthContext";

function App() {
    const { loading, execute } = useApi(api.getNotes);
    const { isAuthenticated, setIsAuthenticated } = useAuth(); // Use the context

    useEffect(() => {
        execute().then(() => {
            setIsAuthenticated(true);
        }).catch(() => {
            setIsAuthenticated(false);
        });
    }, []);

    if (loading) {
        return <Loader />;
    }

    return (
        <Router>
            <Routes>
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/notes" /> : <Navigate to="/login" />}
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
        </Router>
    );
}

export default App;