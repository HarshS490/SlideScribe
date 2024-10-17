import React, { useRef } from "react";

type ModalProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  handleClose: () => void;
};

function Modal({ children, isOpen, handleClose }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (containerRef.current && containerRef.current === e.target) {
      handleClose();
    }
  };
  return (
    <>
      {isOpen && (
        <div className="fixed w-screen min-w-max h-screen  bg-black/50 z-30 left-0 top-0">
          <div
            className="h-full w-full flex flex-col items-center justify-center"
            onClick={handleClick}
            ref={containerRef}
          >
            {children}
          </div>
        </div>
      )}
    </>
  );
}

export default Modal;
