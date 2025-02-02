export interface Note {
  id: string;
  user: string;
  title: string;
  content: string;
  public: boolean;
  createdAt: string;
  updatedAt?: string;
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
  token?: string;
  user?: UserData;
}

export interface User {
  username: string;
  password: string;
}

export interface NoteInput {
  title: string;
  content: string;
}

export interface UserData {
  id: string;
  username: string;
}