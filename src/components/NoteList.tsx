import { memo } from "react";
import NoteCard from "./NoteCard";
import { useNotes } from "../context/NotesContext";

const NoteList = memo(function NoteList() {
  const { notes, loading, error } = useNotes();

  if (loading) {
    return <div>Loading notes...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
});

export default NoteList;
