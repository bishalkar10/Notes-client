import { useState, useEffect } from "react";
import { useNotes } from "../context/NotesContext";
import { faTrash, faEdit, faSave, faCancel } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface NoteDetailProps {
  isCreating: boolean;
  onCreateCancel: () => void;
}

const NoteDetail = ({ isCreating, onCreateCancel }: NoteDetailProps) => {
  const { selectedNote, createNote, updateNote, deleteNote } = useNotes();
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // Reset form when switching between create/edit modes
  useEffect(() => {
    if (isCreating) {
      setTitle('');
      setContent('');
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
    const noteData = { title, content };

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
    if (window.confirm('Are you sure you want to delete this note?')) {
      await deleteNote(selectedNote.id);
    }
  };

  // Empty state
  if (!selectedNote && !isCreating) {
    return (
      <div className="note-detail">
        <h2>Select a note or create a new one</h2>
      </div>
    );
  }


  // Create or Edit mode
 
    return (
      <div className="note-detail">
        <form onSubmit={handleSubmit} className="note-form">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Note title"
            className="note-input"
            disabled={!isEditing && !isCreating}
            autoFocus={isEditing || isCreating}
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Note content"
            className="note-textarea"
            disabled={!isEditing && !isCreating}
          />
          <div className="form-buttons">
          
            <button type="submit" className="submit-button">
              <FontAwesomeIcon icon={faSave} />
            </button>
            {!isCreating && (
              <button 
                type="button" 
                className="delete-button"
                onClick={handleDelete}
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            )}
           {
            ( isCreating || isEditing ) && (
              <button 
                type="button" 
                className="cancel-button"
                onClick={isCreating ? onCreateCancel : () => setIsEditing(false)}
              >
                <FontAwesomeIcon icon={faCancel} />
              </button>)
            }
            {
              (!isCreating && !isEditing) &&
              <button 
                type="button"
                className="edit-button"
                onClick={() => setIsEditing(true)}
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
            }
          </div>
        </form>
      </div>
    );
};

export default NoteDetail