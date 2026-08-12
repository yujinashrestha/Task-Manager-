import { useState } from "react";
import type {  AddTaskFormProps } from "../types/types";


export default function AddTaskForm({
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = "Add Task",
}: AddTaskFormProps) {
  const [title, setTitle] = useState<string>(initialValues?.title ?? "");
  const [description, setDescription] = useState<string>(initialValues?.description ?? "");
  const [tag, setTag] = useState<string>(initialValues?.tag ?? "");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title.trim()) return;

    setSubmitting(true);

    try {
      onSubmit({ title, description, tag });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-2.5 flex flex-col gap-1.5 rounded-lg bg-white p-2.5"
    >
      <input
        autoFocus
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="rounded-md border border-gray-200 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-500"
      />

      <textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={2}
        className="resize-none rounded-md border border-gray-200 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-500"
      />

      <input
        placeholder="Tag (optional)"
        value={tag}
        onChange={(e) => setTag(e.target.value)}
        className="rounded-md border border-gray-200 px-2 py-1.5 text-[13px] outline-none focus:border-indigo-500"
      />

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="border-none bg-transparent text-[13px] text-gray-500 cursor-pointer hover:text-gray-700"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={submitting}
          className="rounded-md border-none bg-indigo-600 px-3 py-1.5 text-[13px] text-white cursor-pointer hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Saving…" : submitLabel}
        </button>
      </div>
    </form>
  );
}