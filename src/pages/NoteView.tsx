import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { Note } from '../types';
import { formatDistanceToNow } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEdit, faLock, faSignInAlt } from '@fortawesome/free-solid-svg-icons';
import Loader from '../components/Loader';
import "../styles/Notes.css";

export default function NoteView() {
  const navigate = useNavigate();
  const { id: noteId } = useParams<{ id: string }>();
  const { isAuthenticated, user } = useAuth();
  const { notes, fetchNoteById } = useNotes();
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);

  useEffect(() => {
    if (!noteId) {
      navigate("/notes");
      return;
    }

    const loadNote = async () => {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      // First check if note exists locally (only if authenticated and notes loaded)
      if (isAuthenticated && notes.length > 0) {
        const existingNote = notes.find(n => n.id === noteId);
        
        if (existingNote) {
          // Check access control
          const isOwner = user?.id === existingNote.user;
          const canAccess = isOwner || existingNote.public;
          
          if (canAccess) {
            setNote(existingNote);
            setLoading(false);
            return;
          } else {
            setAccessDenied(true);
            setLoading(false);
            return;
          }
        }
      }

      // Fetch from API
      try {
        const fetchedNote = await fetchNoteById(noteId);
        if (fetchedNote) {
          // Apply access control
          const isOwner = user?.id === fetchedNote.user;
          const canAccess = isOwner || fetchedNote.public;
          
          if (canAccess) {
            setNote(fetchedNote);
          } else {
            setAccessDenied(true);
          }
        } else {
          setError("Note not found");
        }
      } catch (err: any) {
        // Handle specific error cases
        if (err.message?.includes("Authentication failed") && !isAuthenticated) {
          setAccessDenied(true);
        } else if (err.message?.includes("403") || err.message?.includes("Forbidden")) {
          setAccessDenied(true);
        } else {
          setError("Failed to load note");
        }
      } finally {
        setLoading(false);
      }
    };

    loadNote();
  }, [noteId, isAuthenticated, notes, fetchNoteById, navigate, user]);

  if (loading) {
    return <Loader />;
  }

  // Access denied - show different messages based on authentication status
  if (accessDenied) {
    return (
      <div className="container">
        <div className="note-access-denied">
          <div className="access-denied-content">
            <FontAwesomeIcon icon={faLock} className="access-denied-icon" />
            <h2>Access Restricted</h2>
            <p>
              {isAuthenticated 
                ? "This note is private and you don't have permission to view it."
                : "This note is private. Please log in to access it."
              }
            </p>
            
            <div className="access-denied-actions">
              {!isAuthenticated ? (
                <>
                  <Link to="/login" className="access-action-button login-button">
                    <FontAwesomeIcon icon={faSignInAlt} /> Log In
                  </Link>
                  <Link to="/register" className="access-action-button register-button">
                    Create Account
                  </Link>
                </>
              ) : (
                <button 
                  onClick={() => navigate("/notes")} 
                  className="access-action-button back-button"
                >
                  <FontAwesomeIcon icon={faArrowLeft} /> Back to My Notes
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !note) {
    return (
      <div className="container">
        <div className="note-view-error">
          <h2>{error || "Note not found"}</h2>
          <p>The note you're looking for doesn't exist or has been deleted.</p>
          {isAuthenticated ? (
            <Link to="/notes" className="back-link">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Notes
            </Link>
          ) : (
            <Link to="/login" className="back-link">
              <FontAwesomeIcon icon={faSignInAlt} /> Go to Login
            </Link>
          )}
        </div>
      </div>
    );
  }

  const isOwner = user?.id === note.user;

  return (
    <div className="container">
      <div className="note-view">
        <div className="note-view-header">
          {isAuthenticated ? (
            <Link to="/notes" className="back-link">
              <FontAwesomeIcon icon={faArrowLeft} /> Back to Notes
            </Link>
          ) : (
            <Link to="/login" className="back-link">
              <FontAwesomeIcon icon={faSignInAlt} /> Log In
            </Link>
          )}
          
          {isOwner && (
            <div className="note-view-actions">
              <button 
                className="icon-button edit-button"
                onClick={() => navigate("/notes")}
                title="Edit note"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            </div>
          )}
        </div>

        <div className="note-view-content">
          <div className="note-view-header-content">
            <h1 className="note-view-title">{note.title}</h1>
            
            <div className="note-view-meta">
              {note.updatedAt && isAuthenticated && (
                <span>Updated {formatDistanceToNow(new Date(note.updatedAt))} ago</span>
              )}
              {note.public && <span className="public-badge">Public</span>}
              {!isAuthenticated && (
                <span className="viewing-as-guest">Viewing as guest</span>
              )}
            </div>
          </div>

          <div className="note-view-body">
            <p>{note.content}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
