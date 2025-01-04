export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  status: string;
  data: T;
}

export interface NotesResponse {
  status: string;
  data: Note[];
}

export interface SingleNoteResponse {
  status: string;
  data: Note;
}

export interface AuthResponse {
	status: string;
	message: string;
}

export interface User {
	username: string;
	password: string;
}

export interface NoteInput {
  title: string;
  content: string;
}