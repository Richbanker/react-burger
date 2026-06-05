import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from '@components/modal-overlay/modal-overlay';

import styles from './modal.module.css';

type TModalProps = {
  title?: string;
  children: React.ReactNode;
  onClose: () => void;
};

const modalRoot = document.getElementById('modals');

export const Modal = ({
  title = '',
  children,
  onClose,
}: TModalProps): React.JSX.Element | null => {
  useEffect((): (() => void) => {
    const handleEscClose = (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscClose);

    return (): void => {
      document.removeEventListener('keydown', handleEscClose);
    };
  }, [onClose]);

  if (!modalRoot) {
    return null;
  }

  return createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <section className={styles.modal}>
        <header className={styles.header}>
          <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>
          <button
            className={styles.close_button}
            type="button"
            aria-label="Закрыть модальное окно"
            onClick={onClose}
          >
            <CloseIcon type="primary" />
          </button>
        </header>
        {children}
      </section>
    </>,
    modalRoot
  );
};
