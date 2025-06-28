import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/NoteList';
import "../styles/Notes.css"
import { useAuth } from '../context/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { useNotes } from '../context/NotesContext';
import NoteDetail from '../components/NoteDetail';

export default function Notes() {
	const navigate = useNavigate();
	const { isAuthenticated } = useAuth();
	const { refreshNotes, setSelectedNote } = useNotes();
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

	return (
		<div className="container">
			<NoteList />

			<div className='note-detail-container'>
				<NoteDetail
					isCreating={isCreating}
					onCreateCancel={() => setIsCreating(false)}
					onCreateNew={() => {
						setSelectedNote(null);
						setIsCreating(true);
					}}
				/>

				{/* {!isCreating ?
					<button
						className="add-note-button"
						onClick={() => {
							setSelectedNote(null)
							setIsCreating(true)
						}}
						title="Create new note"
					>
						<FontAwesomeIcon icon={faPlus} />
					</button> : null} */}
			</div>
		</div>
	);
}