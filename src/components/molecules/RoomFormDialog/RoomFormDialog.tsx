import { useEffect, useId, useRef, useState } from 'react';
import type { SubmitEvent } from 'react';
import { Button } from '../../atoms/Button/Button';
import type { RoomInput } from '../../../hooks/useRooms';
import './RoomFormDialog.css';

export type RoomFormDialogProps = {
  /** Controls whether the native `<dialog>` is open. */
  open: boolean;
  /** `create` shows blank fields and a "Create room" title/action; `edit` pre-fills from `initialValues`. */
  mode: 'create' | 'edit';
  /** Pre-filled values in `edit` mode; ignored in `create` mode. */
  initialValues?: RoomInput;
  /** Called with the trimmed form values when the form is submitted. */
  onSubmit: (input: RoomInput) => void;
  /** Called when the dialog is dismissed via Cancel, Esc, or backdrop click. */
  onClose: () => void;
};

const emptyValues = { name: '', description: '' };

/**
 * A native `<dialog>`-based form for creating or editing a room's name and
 * description. Native `<dialog>` gives us focus trapping and Esc-to-close
 * for free, so no custom modal/focus-management logic is needed here.
 */
export function RoomFormDialog({ open, mode, initialValues, onSubmit, onClose }: RoomFormDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const [name, setName] = useState(initialValues?.name ?? emptyValues.name);
  const [description, setDescription] = useState(initialValues?.description ?? emptyValues.description);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) {
      return;
    }
    if (open && !dialog.open) {
      setName(initialValues?.name ?? emptyValues.name);
      setDescription(initialValues?.description ?? emptyValues.description);
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
    // initialValues is intentionally excluded: it should only seed the form
    // when the dialog transitions to open, not on every parent re-render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }
    onSubmit({ name: trimmedName, description: description.trim() || undefined });
  }

  return (
    <dialog
      ref={dialogRef}
      className="sr-room-form-dialog"
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={onClose}
    >
      <form method="dialog" onSubmit={handleSubmit} className="sr-room-form-dialog__form">
        <h2 id={titleId} className="sr-room-form-dialog__title">
          {mode === 'create' ? 'Create room' : 'Edit room'}
        </h2>
        <label className="sr-room-form-dialog__field" htmlFor={`${titleId}-name`}>
          Name
          <input
            id={`${titleId}-name`}
            type="text"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </label>
        <label className="sr-room-form-dialog__field" htmlFor={`${titleId}-description`}>
          Description (optional)
          <textarea
            id={`${titleId}-description`}
            rows={3}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <div className="sr-room-form-dialog__actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">{mode === 'create' ? 'Create room' : 'Save changes'}</Button>
        </div>
      </form>
    </dialog>
  );
}
