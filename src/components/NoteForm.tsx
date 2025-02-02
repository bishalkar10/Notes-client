import { useState, useCallback, useEffect } from "react";
import { Note, NoteInput } from "../types";
import { debounce } from "lodash";

// NoteForm.tsx
interface NoteFormProps {
  onSubmit: (note: NoteInput) => Promise<void>;
  disabled?: boolean;
  initialValues?: NoteInput;
  onCancel?: () => void;
}

export function NoteForm({ 
  onSubmit, 
  disabled,
  initialValues,
  onCancel 
}: NoteFormProps) {
  const [title, setTitle] = useState(initialValues?.title || '');
  const [content, setContent] = useState(initialValues?.content || '');

  useEffect(() => {
    if (initialValues) {
      setTitle(initialValues.title);
      setContent(initialValues.content);
    }
  }, [initialValues]);

  // Debounced submit handler
  const debouncedSubmit = useCallback(
    debounce(async (noteData: NoteInput) => {
      await onSubmit(noteData);
    }, 300),
    [onSubmit]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await debouncedSubmit({ title, content });
    if (!initialValues) {
      setTitle('');
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="note-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Note title"
        disabled={disabled}
      />
      <textarea
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="Note content"
        disabled={disabled}
      />
      <div className="form-buttons">
        <button className="submit-button" type="submit" disabled={disabled}>
          {initialValues ? 'Update Note' : 'Create Note'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="cancel-button">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}