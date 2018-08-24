import React from 'react';
import Modal from 'react-modal';

export default function({ isModalVisible, closeModal, content }) {
  return (
    <Modal
      ariaHideApp={false}
      isOpen={isModalVisible}
      onRequestClose={closeModal}
      style={{
        overlay: {
          zIndex: 3
        },
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          width: '50%',
          transform: 'translate(-50%, -50%)'
        }
      }}
    >
      {content}
    </Modal>
  );
}
