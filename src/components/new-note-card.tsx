import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

export const NewNoteCard = () => {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [content, setContent] = useState("");

  const handleStartEditor = () => {
    setShouldShowOnBoarding(false);
  };

  // Resetting default of Onboarding
  const handleResetEditor = () => {
    setShouldShowOnBoarding(true);
  };

  const handleTyping = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value === "") {
      handleResetEditor();
    }
  };

  const handleSaveNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast.success("Nota criada com sucesso");
  };

  return (
    <Dialog.Root>
      <Dialog.Trigger
        onClick={handleResetEditor}
        className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left hover:ring-2 outline-none hover:ring-slate-600 focus:ring-lime-400  focus-visible:ring-2"
      >
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.DialogOverlay className="inset-0 fixed bg-black/50"></Dialog.DialogOverlay>
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full h-[60vh] bg-slate-700 rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5"></X>
          </Dialog.Close>
          <form onSubmit={handleSaveNote} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button className="font-medium text-lime-400 hover:underline">
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    onClick={handleStartEditor}
                    className="font-medium text-lime-400 hover:underline"
                  >
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <>
                  <textarea
                    autoFocus
                    onChange={handleTyping}
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  ></textarea>
                  <button
                    type="submit"
                    className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                  >
                    Salvar nota
                  </button>
                </>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
