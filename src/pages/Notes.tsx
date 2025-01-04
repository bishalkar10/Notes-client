import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Note, NoteInput } from '../types';
import { api } from '../services/api';
import useApi from '../hooks/useApi';
import {NoteForm, NoteList} from '../components/NoteForm';
import "../styles/Notes.css"

export default function Notes() {
	const [notes, setNotes] = useState<Note[]>([]);
	const navigate = useNavigate();

	const {
		loading: loadingNotes,
		error: notesError,
		execute: fetchNotes
	} = useApi(api.getNotes);

	const {
		loading: creatingNote,
		error: createError,
		execute: executeCreateNote
	} = useApi(api.createNote);

	const {
		loading: deletingNote,
		error: deleteError,
		execute: executeDeleteNote
	} = useApi(api.deleteNote);

	useEffect(() => {
		fetchNotes()
			.then((response) => setNotes(response.data))
			.catch((err) => { 
				console.error("Failed to fetch notes.", err)
				navigate("/login")
			})
	}, []);

	const handleCreateNote = useCallback(async (noteInput: NoteInput) => {
		try {
			const response = await executeCreateNote(noteInput);
			if (response) {
				setNotes(prev => [response.data, ...prev]);
			}
		} catch (err) {
			console.error('Failed to create note:', err);
		}
	}, []);

	const handleDeleteNote = useCallback(async (noteId: string) => {
		try {
			await executeDeleteNote(noteId);
			setNotes(prev => prev.filter(note => note.id !== noteId));
		} catch (err) {
			console.error('Failed to delete note:', err);
		}
	}, []);

	const error = notesError || createError || deleteError;

	if (loadingNotes) {
		return <div>Loading notes...</div>;
	}

	return (
		<div className="container">
			<h2>My Notes</h2>
			
			{error && (
				<div className="error-message">Error: {error}</div>
			)}

			<NoteForm 
				onSubmit={handleCreateNote} 
				disabled={creatingNote}
			/>

			<NoteList 
				notes={notes}
				onDelete={handleDeleteNote}
				deleteInProgress={deletingNote}
			/>
		</div>
	);
}