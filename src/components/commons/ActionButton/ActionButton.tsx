import { EyeIcon, TrashIcon } from "@heroicons/react/24/solid";
import React from "react";

const ActionButton: React.FC<{
  remove?: boolean;
  details?: boolean;
  action?: () => void;
}> = ({ remove = false, details = false, action = () => {} }) => {
  return (
    <div
      role="button"
      className={`py-1 px-2 rounded-lg ${
        details ? "bg-blue-500" : remove ? "bg-red-500" : null
      } flex items-center gap-2 text-white transition-all ease-in hover:translate-y-1`}
      onClick={action}
    >
      {details ? (
        <EyeIcon className="h-5" />
      ) : remove ? (
        <TrashIcon className="h-5" />
      ) : null}
      <p>{details ? "Details" : remove ? "Remove" : null}</p>
    </div>
  );
};

export default ActionButton;
