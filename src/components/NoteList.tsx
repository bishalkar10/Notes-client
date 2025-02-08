import { memo } from 'react';
import NoteCard from './NoteCard';
import { useNotes } from '../context/NotesContext';


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
            <NoteCard
              key={note.id}
              note={note}
            />
          ))}
        </div>
      
  );
});

// const NoteDetail = ({ isCreating, onCreateCancel }: { isCreating: boolean; onCreateCancel: () => void }) => {
//   const { selectedNote, createNote, updateNote, deleteNote } = useNotes();
//   const [isEditing, setIsEditing] = useState(isCreating);
//   const [title, setTitle] = useState(selectedNote?.title || '');
//   const [content, setContent] = useState(selectedNote?.content || '');

//   // Update form when selectedNote changes
//   useEffect(() => {
//     if (selectedNote) {
//       setTitle(selectedNote.title);
//       setContent(selectedNote.content);
//     }
//   }, [selectedNote]);

//   // Reset form when switching between create/edit modes
//   useEffect(() => {
//     setIsEditing(isCreating);
//     if (isCreating) {
//       setTitle('');
//       setContent('');
//     }
//   }, [isCreating]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     const noteData = { title, content };

//     if (isCreating) {
//       await createNote(noteData);
//       onCreateCancel();
//     } else if (selectedNote) {
//       await updateNote(selectedNote.id, noteData);
//       setIsEditing(false);
//     }
//   };

//   const handleDelete = async () => {
//     if (!selectedNote) return;
//     if (window.confirm('Are you sure you want to delete this note?')) {
//       await deleteNote(selectedNote.id);
//     }
//   };

//   if (!selectedNote && !isCreating) {
//     return (
//       <div className="note-detail">
//         <h2>Select a note or create a new one</h2>
//       </div>
//     );
//   }

//   if (isEditing || isCreating) {
//     return (
//       <div className="note-detail">
//         <div className="note-detail-header">
//           <h2>{isCreating ? 'Create Note' : 'Edit Note'}</h2>
//         </div>
//         <form onSubmit={handleSubmit} className="note-form">
//           <input
//             type="text"
//             value={title}
//             onChange={e => setTitle(e.target.value)}
//             placeholder="Note title"
//             className="note-input"
//           />
//           <textarea
//             value={content}
//             onChange={e => setContent(e.target.value)}
//             placeholder="Note content"
//             className="note-textarea"
//           />
//           <div className="form-buttons">
//             <button type="submit" className="submit-button">
//               {isCreating ? 'Create' : 'Update'}
//             </button>
//             {!isCreating && (
//               <button 
//                 type="button" 
//                 className="delete-button"
//                 onClick={handleDelete}
//               >
//                 Delete
//               </button>
//             )}
//             <button 
//               type="button" 
//               className="cancel-button"
//               onClick={isCreating ? onCreateCancel : () => setIsEditing(false)}
//             >
//               Cancel
//             </button>
//           </div>
//         </form>
//       </div>
//     );
//   }

//   return (
//     <div className="note-detail">
//       <div className="note-detail-header">
//         <h2>{selectedNote?.title}</h2>
//         <div className="note-detail-actions">
//           <button 
//             className="edit-button"
//             onClick={() => setIsEditing(true)}
//           >
//             Edit
//           </button>
//           <button 
//             className="delete-button"
//             onClick={handleDelete}
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//       <div className="note-detail-content">
//         {selectedNote?.content}
//       </div>
//     </div>
//   );
// };

export default NoteList; 