import { useState, useEffect } from "react";
import { useNotes } from "../context/NotesContext";
import {
  faTrash,
  faEdit,
  faSave,
  faTimes,
  faFileAlt,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/Notes.css";

interface NoteDetailProps {
  isCreating: boolean;
  onCreateCancel: () => void;
  onCreateNew?: () => void;
}

const NoteDetail = ({ isCreating, onCreateCancel, onCreateNew }: NoteDetailProps) => {
  const { selectedNote, createNote, updateNote, deleteNote, openDeleteConfirmDialog } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  // Reset form when switching between create/edit modes
  useEffect(() => {
    if (isCreating) {
      setTitle("");
      setContent("");
      setIsEditing(true);
    }
  }, [isCreating]);

  // Update form when selectedNote changes
  useEffect(() => {
    if (selectedNote) {
      setTitle(selectedNote.title);
      setContent(selectedNote.content);
      setIsEditing(false);
    }
  }, [selectedNote]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    
    const noteData = { title: title.trim(), content: content.trim() };

    if (isCreating) {
      await createNote(noteData);
      onCreateCancel();
    } else if (selectedNote) {
      await updateNote(selectedNote.id, noteData);
      setIsEditing(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedNote) return;
    if (window.confirm("Are you sure you want to delete this note?")) {
      await deleteNote(selectedNote.id);
    }
  };

  const handleCancel = () => {
    if (isCreating) {
      onCreateCancel();
    } else {
      setIsEditing(false);
      if (selectedNote) {
        setTitle(selectedNote.title);
        setContent(selectedNote.content);
      }
    }
  };

  // Empty state with modern design
  if (!selectedNote && !isCreating) {
    return (
      <div className="note-detail-empty">
        <div className="empty-state">
          <div className="empty-icon">
            <FontAwesomeIcon icon={faFileAlt} />
          </div>
          <h2 className="empty-title">Ready to capture your thoughts?</h2>
          <p className="empty-subtitle">
            Select an existing note from the sidebar or create a new one to get started.
          </p>
          <div className="empty-actions">
            <button 
              className="btn btn-primary"
              onClick={onCreateNew}
            >
              <FontAwesomeIcon icon={faPlus} />
              Create New Note
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Create or Edit mode
  return (
    <div className="note-detail">
      {/* Header with title and actions */}
      <div className="note-detail-header">
        <div className="note-header-info">
          {isCreating ? (
            <h2 className="note-detail-title">Create New Note</h2>
          ) : (
            <div>
              <h2 className="note-detail-title">
                {isEditing ? "Editing Note" : selectedNote?.title}
              </h2>
                             {selectedNote && !isEditing && (
                 <div className="note-meta">
                   <span className="note-date">
                     Last modified: {selectedNote.updatedAt ? new Date(selectedNote.updatedAt).toLocaleDateString() : 'Unknown'}
                   </span>
                 </div>
               )}
            </div>
          )}
        </div>
        
        {!isCreating && !isEditing && (
          <div className="note-actions-header">
            <button
              type="button"
              className="btn btn-primary btn-sm"
              onClick={() => setIsEditing(true)}
              title="Edit note"
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm"
              onClick={(e) => {
                e.stopPropagation();
                if (selectedNote) {
                  openDeleteConfirmDialog(selectedNote.id);
                }
              }}
              title="Delete note"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>

      {/* Content area */}
      {isEditing || isCreating ? (
        <form onSubmit={handleSubmit} className="note-form">
          <div className="note-form-content">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter note title..."
              className="note-input"
              autoFocus
              required
            />
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your note content here..."
              className="note-textarea"
            />
          </div>
          
          <div className="note-form-actions">
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={!title.trim()}
            >
              <FontAwesomeIcon icon={faSave} />
              {isCreating ? "Create Note" : "Save Changes"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleCancel}
            >
              <FontAwesomeIcon icon={faTimes} />
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="note-view-content">
          <div className="note-content-display">
            {selectedNote?.content ? (
              <div className="note-text">
                {selectedNote.content}
              </div>
            ) : (
              <div className="note-empty-content">
                <p>This note is empty. Click edit to add some content.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NoteDetail;
