import React from "react";

export interface IActionsModal {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  title: string;
  children: React.ReactNode;
  action?: string;
  handleAction?: () => void;
  buttonColor?: string;
}

const ModalContainer: React.FC<IActionsModal> = ({
  isOpen,
  setIsOpen,
  title,
  children,
  action,
  handleAction,
  buttonColor,
}) => {
  return (
    <div className={`${isOpen ? "block" : "hidden"}`}>
      <div className="relative z-10">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </div>
      <div className="fixed inset-0 z-20 overflow-y-auto">
        <div className="flex min-h-full justify-center items-center">
          <div className="bg-white  flex flex-col justify-between w-[50%] rounded-lg">
            <div className="flex items-center space-x-2 font-semibold border-b p-5">
              <span className="text-2xl font-semibold">{title}</span>
            </div>
            <div className="p-10">{children}</div>
            <div className="flex border-t p-2 space-x-2 justify-end">
              {action ? (
                <button
                  onClick={handleAction}
                  className={`border p-2 w-fit rounded-lg ${
                    buttonColor ? buttonColor : "bg-blue-400"
                  } text-white  hover:-translate-y-2 duration-300`}
                >
                  {action}
                </button>
              ) : null}
              <button
                onClick={() => setIsOpen(false)}
                className="border p-2 w-fit rounded-lg bg-slate-400 text-white  hover:-translate-y-2 duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalContainer;
