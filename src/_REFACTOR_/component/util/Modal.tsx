import React, {useCallback, useEffect} from 'react';
import {createPortal} from 'react-dom';

type ModalProps = {
  children: React.ReactNode;
  type?: 'small';
  backdrop?: boolean;
};

export interface ModalHandle {
  open: () => void;
  close: () => void;
  isShown: boolean;
}

const modalElement = document.getElementById('modal-container');

export type ModalRef = React.ElementRef<typeof Modal>;

const Modal = React.forwardRef<ModalHandle, ModalProps>(
  ({children, type, backdrop = true}, ref) => {
    const [show, setShow] = React.useState(false);
    // define open and close functions
    const open = useCallback(() => setShow(true), []);
    const close = useCallback(() => setShow(false), []);

    React.useImperativeHandle(ref, () => {
      return {open, close, isShown: show};
    });

    const handleEscape = useCallback(
      (event) => {
        if (event.keyCode === 27) {
          close();
        }
      },
      [close]
    );

    useEffect(() => {
      if (show) {
        document.addEventListener('keydown', handleEscape, false);
      }
      return () => {
        document.removeEventListener('keydown', handleEscape, false);
      };
    }, [handleEscape, show]);

    if (!modalElement) {
      return null;
    }
    return createPortal(
      show ? (
        <div className="modal-wrapper">
          {backdrop && <div onClick={close} className="fixed inset-0 bg-dark-blue-70" />}
          {/* eslint-disable-next-line @typescript-eslint/restrict-template-expressions */}
          <div className={`modal-box ${type}`}>{children}</div>
        </div>
      ) : null,
      modalElement
    );
  }
);
export default Modal;
