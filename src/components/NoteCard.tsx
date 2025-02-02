import { memo, useCallback } from 'react';
import { Note } from '../types';
// import { useAuth } from '../context/AuthContext';
import { formatDistanceToNow } from 'date-fns';
import Switch from './Switch';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faEdit } from '@fortawesome/free-solid-svg-icons';
import '../styles/NoteCard.css';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => Promise<void>;
  onTogglePublic: (id: string, isPublic: boolean) => Promise<void>;
  onEdit: (note: Note) => void;
  currentUserId: string;
  isSelected?: boolean;
}

const NoteCard = memo(function NoteCard({ 
  note, 
  onDelete, 
  onTogglePublic,
  onEdit,
  currentUserId,
  isSelected = false
}: NoteCardProps) {
  const isOwner = currentUserId === note.user;

  const handleTogglePublic = useCallback(async () => {
    await onTogglePublic(note.id, !note.public);
  }, [note.id, note.public, onTogglePublic]);

  return (
    <div className={`note-card ${isSelected ? 'selected' : ''}`}>
      <div className="note-card-header">
        <h3>{note.title}</h3>
      </div>
      
      <p className="note-content">{note.content}</p>
      
      <div className="note-footer">
        <div className="note-metadata">
          {note.updatedAt && (
            <span>Last modified {formatDistanceToNow(new Date(note.updatedAt))} ago</span>
          )}
        </div>
        
        <div className="note-actions">
          {isOwner && (
            <>
              <div className="public-toggle">
                <span>Public</span>
                <Switch
                  checked={note.public}
                  onChange={handleTogglePublic}
                  disabled={!isOwner}
                />
              </div>
              <button 
                onClick={() => onEdit(note)}
                className="icon-button edit-button"
                title="Edit note"
              >
                <FontAwesomeIcon icon={faEdit} />
              </button>
              <button 
                onClick={() => onDelete(note.id)}
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