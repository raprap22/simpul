type Props = {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
};

export default function NewTaskModal({ open, onClose, onSave }: Props) {
  if (!open) return null;

  return (
    <div className="fixed flex items-center justify-center shadow-lg right-16 top-48">
      <div className="bg-white rounded-xl w-10/12">
        <button onClick={onClose} className="w-full text-left py-3 border-b">
          Close
        </button>

        <button onClick={onSave} className="w-full text-left py-3 text-[#2F80ED] font-semibold">
          Save
        </button>
      </div>
    </div>
  );
}
