import { AuthResponse, NotesResponse, User, NoteInput, SingleNoteResponse } from "../types";

const API_URL = 'http://localhost:3000/api';

async function handleApiResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorData = await response.json();
    if (response.status === 401) {
      throw new Error("Authentication failed. Please log in.");
    }
    throw new Error(errorData.message || "An unexpected error occurred.");
  }
  return response.json();
}

//useApi(api.createNote({title, content}))
export const api = {
  async getNotes(): Promise<NotesResponse> {
    const response = await fetch(`${API_URL}/notes`, {
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  async createNote(noteInput: NoteInput): Promise<SingleNoteResponse> {
    const response = await fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(noteInput),
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  async deleteNote(noteId: string): Promise<void> {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    return handleApiResponse(response);
  },

  async login(user: User): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: 'include',
      body: JSON.stringify(user),
    });
    
    const data = await handleApiResponse<AuthResponse>(response);
    
    if (data.token) {
      const expiryDate = new Date();
      expiryDate.setDate(expiryDate.getDate() + 7);
      document.cookie = `session_token=${data.token}; expires=${expiryDate.toUTCString()}; path=/`;
    }
    
    return data;
  },

  async register(user: User): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(user),
    });
    return handleApiResponse(response);
  },

  async logout(): Promise<void> {
    document.cookie = "session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    return Promise.resolve();
  },

  async updateNotePublic(noteId: string, isPublic: boolean): Promise<SingleNoteResponse> {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ public: isPublic }),
    });
    return handleApiResponse(response);
  },

  async updateNote(noteId: string, { title, content }: NoteInput): Promise<SingleNoteResponse> {
    const response = await fetch(`${API_URL}/notes/${noteId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ title, content }),
    });
    return handleApiResponse(response);
  },
};
