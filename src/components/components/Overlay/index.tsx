import React, { Fragment, ReactNode } from 'react';
import './Overlay.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export const Overlay: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  return (
    <Fragment>
      {isOpen && (
        <div className="overlay">
          <div className="overlay__background"/>
          <div className="overlay__container">
            <div className="overlay__controls"></div>
            {children}
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default Overlay;
