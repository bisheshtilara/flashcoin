import Button from "@/components/commons/Button";
import flashCoinLogo from "@assets/logos/primary_logo.svg";
import googleLogo from "@assets/logos/google.svg";
import TextInput from "@components/commons/TextInput";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [loading, setLoading] = React.useState<boolean>(false);
  const { signin, signout, signinWithGoogle } = useAuth();

  return (
    <div className="bg-white border shadow-md rounded-xl p-4 w-[28rem]">
      <div className="flex justify-center w-full">
        <img src={flashCoinLogo} alt="FlashCoin" className="h-40" />
      </div>
      <div className="flex flex-col gap-2 pb-8">
        <p className="text-center text-3xl font-semibold text-red-600">
          Signin
        </p>
        <div className="flex items-center justify-center text-base gap-1">
          <p className="text-center text-gray-500">Don't have an account?</p>
          <p
            onClick={() => navigate("/auth/signup")}
            className="text-red-600 ease-in transition-all hover:-translate-y-1 hover:underline cursor-pointer"
          >
            Signup.
          </p>
        </div>
      </div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setLoading(true);
          // signout user if already signed in
          signout().then(() =>
            signin(email, password).finally(() => setLoading(false))
          );
        }}
        className="grid grid-cols-2 gap-6"
      >
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
        <Button
          type="submit"
          label="Signin"
          loading={loading}
          tailwindStyle="col-span-2"
        />
        <Button
          onClick={() => {
            setLoading(true);
            signinWithGoogle().finally(() => setLoading(false));
          }}
          label="Signin with Google"
          image={googleLogo}
          tailwindStyle="col-span-2"
          secondary
          loading={loading}
        />
      </form>
    </div>
  );
};

export default Signin;
