import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/NoteList';
import "../styles/Notes.css"
import { useAuth } from '../context/AuthContext';
import NoteDetail from '../components/NoteDetail';
import { useNotes } from '../context/NotesContext';
import { FaRegLightbulb } from 'react-icons/fa'; // Import the icon

export default function Notes() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const { refreshNotes, setSelectedNote, notes, selectedNote } = useNotes(); // Destructure notes and selectedNote
	const [isCreating, setIsCreating] = useState(false);

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}
		refreshNotes();
	}, [isAuthenticated]);

	if (!isAuthenticated) {
		return null;
	}
	const isNoteEmpty = notes.length === 0
	const showEmptyState = isNoteEmpty && !isCreating && !selectedNote; // Condition for empty state

	return (
		<div className="container">
			{notes.length > 0 && <NoteList />}

			<div className={`note-detail-container ${isNoteEmpty ? 'empty' : ''}`}>
				{showEmptyState ? (
					<div className="note-detail-empty">
						<div className="empty-state">
							<FaRegLightbulb className="empty-icon" />
							<h2 className="empty-title">Ready to capture your thoughts?</h2>
							<p className="empty-subtitle">
								Select an existing note from the sidebar or create a new one to get started.
							</p>
							<div className="empty-actions">
								<button
									className="btn btn-primary"
									onClick={() => {
										setSelectedNote(null);
										setIsCreating(true);
									}}
								>
									+ Create New Note
								</button>
							</div>
						</div>
					</div>
				) : (
					<NoteDetail
						isCreating={isCreating}
						onCreateCancel={() => setIsCreating(false)}
						onCreateNew={() => {
							setSelectedNote(null);
							setIsCreating(true);
						}}
					/>
				)}
			</div>
		</div>
	);
}
