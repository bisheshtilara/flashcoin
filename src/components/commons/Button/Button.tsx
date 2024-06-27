import React from "react";
import { CircleLoader } from "react-spinners";

export interface IButtonProps {
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  secondary?: boolean;
  disabled?: boolean;
  loading?: boolean;
  tailwindStyle?: string;
  label?: string;
  type?: "button" | "submit" | "reset" | undefined;
  image?: string;
  imageStyle?: string;
  //Add alt type string later
}

const Button: React.FC<IButtonProps> = ({
  onClick,
  disabled,
  loading,
  tailwindStyle,
  label,
  type = "button",
  secondary,
  image,
  imageStyle,
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${tailwindStyle} ${
        secondary ? "border" : "text-white bg-red-600"
      } ${
        image ? "gap-3" : ""
      } w-full rounded-lg h-12 ease-in transition-all hover:-translate-y-1 flex items-center justify-center`}
      type={type}
    >
      {loading ? (
        <CircleLoader color={`${secondary ? "#dc2626" : "#fff"}`} size={35} />
      ) : (
        <>
          {image && (
            <img
              src={image}
              alt="Alt"
              className={`${
                imageStyle ? imageStyle : "h-8 bg-white rounded-full"
              }`}
            />
          )}
          <p>{label}</p>{" "}
        </>
      )}
    </button>
  );
};

export default Button;
