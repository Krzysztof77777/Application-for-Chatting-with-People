import React, { useEffect, useRef } from "react";
import ReactDOM from "react-dom";

const InfoModal = ({
  children,
  handleOnClose,
  isOpen,
  shouldBeCloseOnOutsideClick,
}) => {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!modalRef.current) {
      return;
    }

    const { current: modal } = modalRef;

    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      showModal();
    } else if (previousActiveElement.current) {
      closeModal();
      previousActiveElement.current.focus();
    }
  }, [isOpen]);

  const showModal = () => {
    modalRef.current.classList.remove("none");
    modalRef.current.classList.add("block");
  };

  const closeModal = () => {
    modalRef.current.classList.remove("block");
    modalRef.current.classList.add("none");
  };

  useEffect(() => {
    const { current: modal } = modalRef;

    const handleCancel = (event) => {
      event.preventDefault();
      handleOnClose();
    };

    modal.addEventListener("cancel", handleCancel);

    return () => {
      modal.removeEventListener("cancel", handleCancel);
    };
  }, [handleOnClose]);

  const handleOutsideClick = ({ target }) => {
    const { current } = modalRef;

    if (shouldBeCloseOnOutsideClick && target === current) {
      handleOnClose();
    }
  };

  return ReactDOM.createPortal(
    <div ref={modalRef} onClick={handleOutsideClick} className="modal">
      {isOpen && children}
    </div>,
    document.body
  );
};

export default InfoModal;
