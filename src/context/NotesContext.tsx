import { createContext, useContext, useState, useCallback, ReactNode, useRef, useEffect } from 'react';
import { Note, NoteInput } from '../types';
import { api } from '../services/api';
import useApi from '../hooks/useApi';

interface NotesContextType {
  notes: Note[];
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => void;
  loading: boolean;
  error: string | null;
  createNote: (noteInput: NoteInput) => Promise<void>;
  updateNote: (noteId: string, noteInput: NoteInput) => Promise<void>;
  deleteNote: (noteId: string) => Promise<void>;
  togglePublic: (noteId: string, isPublic: boolean) => Promise<void>;
  refreshNotes: () => Promise<void>;
  fetchNoteById: (noteId: string) => Promise<Note | null>;
  showDeleteConfirmDialog: boolean;
  noteIdToDelete: string | null;
  openDeleteConfirmDialog: (noteId: string) => void;
  closeDeleteConfirmDialog: () => void;
  dialogRef: React.RefObject<HTMLDialogElement>;
}

const NotesContext = createContext<NotesContextType | null>(null);

export function NotesProvider({ children }: { children: ReactNode }) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showDeleteConfirmDialog, setShowDeleteConfirmDialog] = useState(false);
  const [noteIdToDelete, setNoteIdToDelete] = useState<string | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const { loading, error, execute: fetchNotes } = useApi(api.getNotes);
  const { execute: executeCreate } = useApi(api.createNote);
  const { execute: executeUpdate } = useApi(api.updateNote);
  const { execute: executeDelete } = useApi(api.deleteNote);
  const { execute: executeTogglePublic } = useApi(api.updateNotePublic);
  const { execute: executeFetchNote } = useApi(api.getNote);

  useEffect(() => {
    if (showDeleteConfirmDialog && dialogRef.current) {
      dialogRef.current.showModal();
    }
  }, [showDeleteConfirmDialog]);

  const refreshNotes = useCallback(async () => {
    const response = await fetchNotes();
    setNotes(response.data);
  }, [fetchNotes]);

  const fetchNoteById = useCallback(async (noteId: string): Promise<Note | null> => {
    try {
      const response = await executeFetchNote(noteId);
      const note = response.data;
      
      // Add to notes if not already present
      setNotes(prev => {
        const exists = prev.find(n => n.id === noteId);
        if (!exists) {
          return [note, ...prev];
        }
        return prev;
      });
      
      return note;
    } catch (error) {
      console.error('Failed to fetch note:', error);
      return null;
    }
  }, [executeFetchNote]);

  const createNote = useCallback(async (noteInput: NoteInput) => {
    const response = await executeCreate(noteInput);
    setNotes(prev => [response.data, ...prev]);
  }, [executeCreate]);

  const updateNote = useCallback(async (noteId: string, noteInput: NoteInput) => {
    const response = await executeUpdate(noteId, noteInput);
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...response.data } : note
    ));
    setSelectedNote(prev => prev?.id === noteId ? response.data : prev);
  }, [executeUpdate]);

  const deleteNote = useCallback(async (noteId: string) => {
    await executeDelete(noteId);
    setNotes(prev => prev.filter(note => note.id !== noteId));
    setSelectedNote(prev => prev?.id === noteId ? null : prev);
    closeDeleteConfirmDialog(); // Close dialog after deletion
  }, [executeDelete]);

  const openDeleteConfirmDialog = useCallback((noteId: string) => {
    console.log("openDeleteConfirmDialog", noteId);
    setNoteIdToDelete(noteId);
    setShowDeleteConfirmDialog(true);
  }, []);

  const closeDeleteConfirmDialog = useCallback(() => {
    setNoteIdToDelete(null);
    setShowDeleteConfirmDialog(false);
    dialogRef.current?.close();
  }, []);

  const togglePublic = useCallback(async (noteId: string, isPublic: boolean) => {
    const response = await executeTogglePublic(noteId, isPublic);
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, ...response.data } : note
    ));
    setSelectedNote(prev => prev?.id === noteId ? { ...prev, ...response.data } : prev);
  }, [executeTogglePublic]);

  const value = {
    notes,
    selectedNote,
    setSelectedNote,
    loading,
    error,
    createNote,
    updateNote,
    deleteNote,
    togglePublic,
    refreshNotes,
    fetchNoteById,
    showDeleteConfirmDialog,
    noteIdToDelete,
    openDeleteConfirmDialog,
    closeDeleteConfirmDialog,
    dialogRef
  };

  return (
    <NotesContext.Provider value={value}>
      {children}
    </NotesContext.Provider>
  );
}

export function useNotes() {
  const context = useContext(NotesContext);
  if (!context) {
    throw new Error('useNotes must be used within a NotesProvider');
  }
  return context;
}
