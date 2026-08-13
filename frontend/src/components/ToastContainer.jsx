import React from "react";
import { useToast } from "../ToastContext";

const ToastItem = ({ t, onClose }) => {
  const bg = t.type === "error" ? "bg-red-600" : t.type === "success" ? "bg-green-600" : "bg-gray-800";
  return (
    <div className={`text-white px-4 py-2 rounded shadow-md ${bg} mb-2 max-w-xs`}> 
      <div className="flex justify-between items-start gap-2">
        <div className="text-sm">{t.message}</div>
        <button onClick={() => onClose(t.id)} className="ml-2 text-white/80">✕</button>
      </div>
    </div>
  );
};

export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed right-4 bottom-4 z-50 flex flex-col items-end">
      {toasts.map((t) => (
        <ToastItem key={t.id} t={t} onClose={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
