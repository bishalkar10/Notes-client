import { memo, useState } from "react";
import { Note } from "../types";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import Switch from "./Switch";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCopy, faCheck } from "@fortawesome/free-solid-svg-icons";
import "../styles/NoteCard.css";
import { useNotes } from "../context/NotesContext";

interface NoteCardProps {
  note: Note;
}

const NoteCard = memo(function NoteCard({ note }: NoteCardProps) {
  const { user } = useAuth();
  const { togglePublic, selectedNote, setSelectedNote, openDeleteConfirmDialog } =
    useNotes();
  const [copied, setCopied] = useState(false);

  const isOwner = user?.id === note.user;
  const isSelected = selectedNote?.id === note.id;

  const handleCopyUrl = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/notes/${note.id}`;
    
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = url;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className={`note-card ${isSelected ? "selected" : ""}`}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedNote(note);
      }}
    >
      <div className="note-card-header">
        <h3>{note.title}</h3>
      </div>

      <p className="note-content">{note.content}</p>

      <div className="note-footer">
        <div className="note-metadata">
          {note.updatedAt && (
            <span>{formatDistanceToNow(new Date(note.updatedAt))} ago</span>
          )}
        </div>

        <div className="note-actions">
          <button
            onClick={handleCopyUrl}
            className="icon-button copy-button"
            title={copied ? "Copied!" : "Copy link"}
          >
            <FontAwesomeIcon icon={copied ? faCheck : faCopy} />
          </button>
          
          {isOwner && (
            <>
              <div className="public-toggle">
                <span>Public</span>
                <Switch
                  checked={note.public}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => togglePublic(note.id, !note.public)}
                  disabled={!isOwner}
                />
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  openDeleteConfirmDialog(note.id);
                }}
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
