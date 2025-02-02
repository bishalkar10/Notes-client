import { useState, useCallback } from 'react';
import { Note, NoteInput, NotesResponse, SingleNoteResponse } from '../types';
import { api } from '../services/api';
import useApi from './useApi';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { loading, error, execute: fetchNotes } = useApi<NotesResponse, []>(api.getNotes);
  const { execute: executeCreateNote } = useApi<SingleNoteResponse, [NoteInput]>(api.createNote);
  const { execute: executeDeleteNote } = useApi<void, [string]>(api.deleteNote);
  const { execute: executeUpdateNote } = useApi<SingleNoteResponse, [string, NoteInput]>(api.updateNote);

  const refreshNotes = useCallback(async () => {
    const response = await fetchNotes();
    setNotes(response.data);
  }, [fetchNotes]);

  const createNote = useCallback(async (noteInput: NoteInput) => {
    const response = await executeCreateNote(noteInput);
    setNotes(prev => [response.data, ...prev]);
    return response;
  }, [executeCreateNote]);

  const deleteNote = useCallback(async (noteId: string) => {
    await executeDeleteNote(noteId);
    setNotes(prev => prev.filter(note => note.id !== noteId));
  }, [executeDeleteNote]);

  const updateNote = useCallback(async (noteInput: Partial<Note> & { id: string }) => {
    const { id, title, content } = noteInput;
    if (!title || !content) return;
    
    const response = await executeUpdateNote(id, { title, content });
    setNotes(prevNotes => 
      prevNotes.map(note => 
        note.id === response.data.id ? response.data : note
      )
    );
    return response;
  }, [executeUpdateNote]);

  return {
    notes,
    loading,
    error,
    refreshNotes,
    createNote,
    deleteNote,
    updateNote
  };
} 