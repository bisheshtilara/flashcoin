import React from "react";
import ModalContainer from "../ModalContainer";

export interface IActionsListModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  handleAction?: any;
}

const ActionsListModal: React.FC<IActionsListModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  handleAction,
}) => {
  const content =
    "Are you sure you want to delete the selected item? This action is permanent and cannot be undone.";
  return (
    <ModalContainer
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      action="Delete"
      buttonColor="bg-red-400"
      children={<p>{content}</p>}
      handleAction={handleAction}
    />
  );
};

export default ActionsListModal;
