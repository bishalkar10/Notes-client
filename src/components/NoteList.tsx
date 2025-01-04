import { Note } from '../types';

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => Promise<void>;
}

export default function NoteList({ notes, onDelete }: NoteListProps) {
  return (
    <ul className="note-list">
      {notes.map((note) => (
        <li key={note.id} className="note-item">
          <h3>{note.title}</h3>
          <p>{note.content}</p>
          <button 
            onClick={() => onDelete(note.id)}
            className="delete-button"
          >
            Delete
          </button>
        </li>
      ))}
    </ul>
  );
}; 