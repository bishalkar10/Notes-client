import { memo } from 'react';
import { Note } from '../types';
import NoteCard from './NoteCard';

interface NoteListProps {
  notes: Note[];
  onDelete: (noteId: string) => Promise<void>;
  currentUserId: string;
  onNoteUpdate: (noteInput: { title: string; content: string }) => Promise<void>;
  selectedNoteId?: string;
  onNoteSelect: (note: Note) => void;
}

const NoteList = memo(function NoteList({ 
  notes, 
  onDelete, 
  currentUserId,
  onNoteUpdate,
  selectedNoteId,
  onNoteSelect
}: NoteListProps) {
  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          onDelete={onDelete}
          onEdit={() => onNoteSelect(note)}
          currentUserId={currentUserId}
          isSelected={selectedNoteId === note.id}
        />
      ))}
    </div>
  );
});

export default NoteList; 