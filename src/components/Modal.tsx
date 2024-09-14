import React from "react";

interface ModalProps {
  title: string;
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ title, isOpen, onClose, children }) => {
  if (!isOpen) return null;

  // Gestionnaire pour fermer le modal si on clique sur le fond
  const handleBackdropClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Empêche le clic de se propager plus loin
    onClose(); // Appelle la fonction de fermeture du modal
  };

  // Empêche le modal de se fermer lorsqu'on clique sur le contenu
  const handleContentClick = (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation(); // Empêche le clic de se propager au div du fond
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick} // Ajout de l'écouteur ici
    >
      <div
        className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-2xl"
        onClick={handleContentClick} // Empêche la fermeture lorsque le contenu est cliqué
      >
        <div className="flex justify-between items-center border-b px-6 py-4">
          <div />
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <span className="sr-only">Fermer</span>
            &#10005; {/* Croix de fermeture */}
          </button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

export default Modal;
