import { memo, useCallback } from 'react';
import { Note } from '../types';
import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Switch from './Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../styles/NoteCard.css';
import { useNotes } from '../context/NotesContext';
interface NoteCardProps {
  note: Note;
}

const NoteCard = memo(function NoteCard({ 
  note,
}: NoteCardProps) {
  const { user } = useAuth()
  const { deleteNote, togglePublic, selectedNote, setSelectedNote } = useNotes();

  const isOwner = user?.id === note.user;

  const isSelected = selectedNote?.id === note.id;

  return (
    <div className={`note-card ${isSelected ? 'selected' : ''}`}
      onClick={() => setSelectedNote(note)}
    >
      <div className="note-card-header">
        <h3>{note.title}</h3>
      </div>
      
      <p className="note-content">{note.content}</p>
      
      <div className="note-footer">
        <div className="note-metadata">
          {note.updatedAt && (
            <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
          )}
        </div>
        
        <div className="note-actions">
          {isOwner && (
            <>
              <div className="public-toggle">
                <span>Public</span>
                <Switch
                  checked={note.public}
                  onChange={() => togglePublic(note.id, !note.public)}
                  disabled={!isOwner}
                />
              </div>
              <button 
                onClick={() => deleteNote(note.id)}
                className="icon-button delete-button"
                title="Delete note"
              >
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

export default NoteCard; 