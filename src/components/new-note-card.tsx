import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { toast } from "sonner";

interface NewNoteCardProps {
  onNoteCreated: (content: string) => void;
}

// Creating a global varible to be able to stop recording. Need to be outside of the component
let speechRecognition: SpeechRecognition | null = null;

export const NewNoteCard = ({ onNoteCreated }: NewNoteCardProps) => {
  const [shouldShowOnBoarding, setShouldShowOnBoarding] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [content, setContent] = useState("");

  // Resetting default of Onboarding
  const handleResetEditor = () => {
    setIsRecording(false);
    setContent("");
    setShouldShowOnBoarding(true);
  };

  //=======================================
  // Text Note Functions
  //=======================================
  // Starting Text Note Creation
  const handleStartEditor = () => {
    setShouldShowOnBoarding(false);
  };

  // Handle text change in textArea in Text Note Creation
  const handleTextAreaChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setContent(event.target.value);
    if (event.target.value === "") {
      handleResetEditor();
    }
  };

  // Handle the save event in textArea in Text Note Creation
  const handleSaveNote = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Saving note on state (app.tsx)
    onNoteCreated(content);
    toast.success("Nota criada com sucesso");

    handleResetEditor();
  };

  //=======================================
  // Record Audio Note Functions
  //=======================================

  const handleStartRecording = () => {
    const isSpeechRecognitionAPIAvailable =
      "SpeechRecognition" in window || "webkitSpeechRecognition" in window;

    if (!isSpeechRecognitionAPIAvailable) {
      alert("Infelizmente seu navegador não suporta essa funcionalidade");
      return;
    }

    setShouldShowOnBoarding(false);
    setIsRecording(true);

    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    speechRecognition = new SpeechRecognitionAPI();
    speechRecognition.lang = "pt-BR";
    speechRecognition.continuous = true;
    speechRecognition.maxAlternatives = 1;
    speechRecognition.interimResults = true;

    speechRecognition.onresult = (event) => {
      const transcription = Array.from(event.results).reduce((text, result) => {
        return text.concat(result[0].transcript);
      }, "");

      setContent(transcription);
    };

    speechRecognition.onerror = (event) => {
      console.error(event);
    };

    speechRecognition.start();
  };

  const handleStopRecording = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsRecording(false);
    if (speechRecognition !== null) speechRecognition.stop();
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
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5"></X>
          </Dialog.Close>
          <form onSubmit={handleSaveNote} className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>
              {/* Onbording */}
              {shouldShowOnBoarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button
                    onClick={handleStartRecording}
                    className="font-medium text-lime-400 hover:underline"
                  >
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
                    value={content}
                    onChange={handleTextAreaChange}
                    className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  ></textarea>
                  {isRecording ? (
                    <button
                      type="button"
                      onClick={handleStopRecording}
                      className="w-full flex items-center justify-center gap-3 bg-slate-900 py-4 text-center text-sm text-slate-300 outline-none font-medium hover:text-slate-100"
                    >
                      <div className="size-3 rounded-full bg-red-500 animate-ping"></div>
                      Gravando... clique para interromper.
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
                    >
                      Salvar nota
                    </button>
                  )}
                </>
              )}
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
