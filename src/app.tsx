import { useState } from "react";
import logo from "./assets/logo-nlw-expert.svg";
import { NewNoteCard } from "./components/new-note-card";
import { NoteCard } from "./components/note-card";

interface Note {
  id: string;
  date: Date;
  content: string;
}

export function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    const notesOnStorage = localStorage.getItem("easyNotesArray");
    return notesOnStorage ? JSON.parse(notesOnStorage) : [];
  });

  const [search, setSearch] = useState("");

  //========================================
  // Functions
  const onNoteCreated = (content: string) => {
    const newNote = {
      id: crypto.randomUUID(),
      date: new Date(),
      content,
    };

    const easyNotesArray = [newNote, ...notes];
    // Saving data from new-note-card
    setNotes(easyNotesArray);

    localStorage.setItem("easyNotesArray", JSON.stringify(easyNotesArray));
  };

  const onNoteDelete = (id: string) => {
    const easyNotesArray = notes.filter((note) => note.id !== id);

    // Saving data
    setNotes(easyNotesArray);

    // update the array after deleting an Note
    localStorage.setItem("easyNotesArray", JSON.stringify(easyNotesArray));
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;

    setSearch(query);
  };

  const onFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Stop the form submit
    event.preventDefault();
  };
  //========================================

  const filteredNotes =
    search !== ""
      ? notes.filter((note) =>
          note.content.toLocaleLowerCase().includes(search.toLocaleLowerCase())
        )
      : notes;

  return (
    <div className="mx-auto max-w-6xl my-12 space-y-6 px-5">
      <img src={logo} alt="header logo" />

      <form className="w-full" onSubmit={onFormSubmit}>
        <input
          type="text"
          placeholder="Busque em suas notas"
          onChange={handleSearch}
          className="w-full bg-transparent text-3xl font-semibold tracking-tight outline-none placeholder:text-slate-500"
        />
      </form>

      <div className="h-px bg-slate-700" />

      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[250px]">
        <NewNoteCard onNoteCreated={onNoteCreated} />
        {filteredNotes.map((note) => (
          <NoteCard key={note.id} note={note} onNoteDelete={onNoteDelete} />
        ))}
      </div>
    </div>
  );
}
