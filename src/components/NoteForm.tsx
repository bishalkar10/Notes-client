import { useState } from "react";
import { Note, NoteInput } from "../types";

// NoteForm.tsx
interface NoteFormProps {
  onSubmit: (note: NoteInput) => Promise<void>;
  disabled?: boolean;
}

export function NoteForm({ onSubmit, disabled }: NoteFormProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({ title, content });
    setTitle('');
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
        disabled={disabled}
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Note content"
        disabled={disabled}
      />
      <button className="submit-button" type="submit" disabled={disabled}>
        {disabled ? 'Creating...' : 'Create Note'}
      </button>
    </form>
  );
}

// NoteList.tsx
interface NoteListProps {
  notes: Note[];
  onDelete: (id: string) => Promise<void>;
  deleteInProgress?: boolean;
}

export function NoteList({ notes, onDelete, deleteInProgress }: NoteListProps) {
  return (
    <div className="notes-list">
      {notes.map(note => (
        <div key={note.id} className="note-item">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button 
            className="delete-button"
            onClick={() => onDelete(note.id)}
            disabled={deleteInProgress}
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}