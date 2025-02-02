import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NoteForm } from '../components/NoteForm';
import NoteList from '../components/NoteList';
import { useNotes } from '../hooks/useNotes';
import "../styles/Notes.css"
import { useAuth } from '../context/AuthContext';
import { Note } from '../types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export default function Notes() {
	const navigate = useNavigate();
	const { user } = useAuth();
	const { 
		notes,
		loading,
		error,
		refreshNotes,
		createNote,
		deleteNote,
		updateNote
	} = useNotes();

	const [selectedNote, setSelectedNote] = useState<Note | null>(null);
	const [isCreating, setIsCreating] = useState(false);

	useEffect(() => {
		refreshNotes().catch(() => navigate("/login"));
	}, []);

	console.log("notes", notes);

	if (loading) {
		return <div>Loading notes...</div>;
	}

	if (!user) {
		navigate("/login");
		return null;
	}

	const handleNoteCreate = async (noteInput: { title: string; content: string }) => {
		try {
			const response = await createNote(noteInput);
			// Add new note to the beginning of the list
			updateNote(response.data);
			setIsCreating(false);
		} catch (error) {
			console.error('Failed to create note:', error);
		}
	};

	const handleNoteUpdate = async (noteInput: { title: string; content: string }) => {
		if (!selectedNote) return;
		
		try {
			const response = await updateNote({
				...selectedNote,
				...noteInput
			});
			setSelectedNote(response.data);
		} catch (error) {
			console.error('Failed to update note:', error);
		}
	};

	const handleNoteDelete = async (noteId: string) => {
		try {
			await deleteNote(noteId);
			if (selectedNote?.id === noteId) {
				setSelectedNote(null);
			}
		} catch (error) {
			console.error('Failed to delete note:', error);
		}
	};

	return (
		<div className="container">
			<div className="notes-sidebar">
				<h2>My Notes</h2>
				
				{error && (
					<div className="error-message">Error: {error}</div>
				)}

				<NoteList 
					notes={notes}
					onDelete={handleNoteDelete}
					currentUserId={user.id}
					onNoteUpdate={handleNoteUpdate}
					selectedNoteId={selectedNote?.id}
					onNoteSelect={setSelectedNote}
				/>
			</div>

			<div className="notes-main">
				{isCreating ? (
					<div className="note-detail">
						<h2>Create New Note</h2>
						<NoteForm 
							onSubmit={handleNoteCreate}
							onCancel={() => setIsCreating(false)}
							disabled={loading}
						/>
					</div>
				) : selectedNote ? (
					<div className="note-detail">
						<div className="note-detail-header">
							<h2>{selectedNote.title}</h2>
						</div>
						<NoteForm
							initialValues={{
								title: selectedNote.title,
								content: selectedNote.content
							}}
							onSubmit={handleNoteUpdate}
							onCancel={() => setSelectedNote(null)}
							disabled={loading}
						/>
					</div>
				) : (
					<div className="note-detail">
						<h2>Select a note or create a new one</h2>
					</div>
				)}
			</div>

			{!isCreating && (
				<button 
					className="add-note-button"
					onClick={() => setIsCreating(true)}
					title="Create new note"
				>
					<FontAwesomeIcon icon={faPlus} />
				</button>
			)}
		</div>
	);
}