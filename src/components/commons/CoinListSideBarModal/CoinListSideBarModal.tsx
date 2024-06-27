import React, { ReactNode } from "react";
import ModalContainer from "../ModalContainer";

export interface IActionsListModalProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  handleAction?: any;
  action: string;
  content?: ReactNode;
}

const CoinListSideBarModal: React.FC<IActionsListModalProps> = ({
  isOpen,
  setIsOpen,
  title,
  handleAction,
  action,
  content,
}) => {
  return (
    <ModalContainer
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      title={title}
      action={action}
      buttonColor="bg-blue-400"
      children={content}
      handleAction={handleAction}
    />
  );
};

export default CoinListSideBarModal;
