import { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Loader from "./components/Loader";
import { NotesProvider, useNotes } from './context/NotesContext';
import './App.css';

// Lazy load pages
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Notes = lazy(() => import("./pages/Notes"));
const NoteView = lazy(() => import("./pages/NoteView"));

function App() {
  const { loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="app-container">
      <Router>
          <NotesProvider>
            <AppContent />
          </NotesProvider>
      </Router>
    </div>
  );
}

function AppContent() {
  const { isAuthenticated } = useAuth();
  const { showDeleteConfirmDialog, noteIdToDelete, deleteNote, closeDeleteConfirmDialog, dialogRef } = useNotes();

  return (
    <>
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
            path="/notes/:id"
            element={<NoteView />}
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

      {showDeleteConfirmDialog && (
        <dialog ref={dialogRef} className="delete-confirm-dialog" onClick={(e) => e.stopPropagation()}>
          <p>Are you sure you want to delete this note?</p>
          <div className="dialog-actions">
            <button onClick={(e) => {
              e.stopPropagation();
              if (noteIdToDelete) {
                deleteNote(noteIdToDelete);
              }
            }}>Confirm</button>
            <button onClick={(e) => {
              e.stopPropagation();
              closeDeleteConfirmDialog();
            }}>Cancel</button>
          </div>
        </dialog>
      )}
    </>
  );
}

export default App;
