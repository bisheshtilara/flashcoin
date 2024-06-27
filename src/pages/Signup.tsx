import Button from "@/components/commons/Button";
import flashCoinLogo from "@assets/logos/primary_logo.svg";
import googleLogo from "@assets/logos/google.svg";
import TextInput from "@components/commons/TextInput";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = React.useState<string>("");
  const [lastName, setLastName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [confirmPassword, setConfirmPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { signup, signinWithGoogle } = useAuth();
  return (
    <div className="bg-white border shadow-md rounded-xl w-[30rem] px-4 pb-4">
      <div className="flex justify-center w-full">
        <img src={flashCoinLogo} alt="FlashCoin" className="h-40" />
      </div>
      <div className="flex flex-col gap-2 pb-8">
        <p className=" text-center text-3xl font-semibold text-red-600">
          Signup
        </p>
        <div className="flex items-center justify-center gap-1 text-base">
          <p className="text-center text-gray-500">Already have an account?</p>
          <p
            onClick={() => navigate("/auth/signin")}
            className="text-red-600 ease-in transition-all hover:-translate-y-1 hover:underline cursor-pointer"
          >
            Signin.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          signup(firstName, lastName, email, password, confirmPassword).finally(
            () => setLoading(false)
          );
        }}
        className="grid grid-cols-2 gap-6"
      >
        <TextInput
          label="First name"
          containerStyle="col-span-1"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <TextInput
          label="Last name"
          containerStyle="col-span-1"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <TextInput
          label="Email"
          containerStyle="col-span-2"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextInput
          label="Password"
          containerStyle="col-span-2"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextInput
          label="Confirm Password"
          containerStyle="col-span-2"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button
          label="Signup"
          loading={loading}
          type="submit"
          tailwindStyle="col-span-2"
        />
        <Button
          onClick={() => signinWithGoogle()}
          label="Signup with Google"
          image={googleLogo}
          tailwindStyle="col-span-2"
          secondary
          loading={loading}
        />
      </form>
    </div>
  );
};

export default Signup;
