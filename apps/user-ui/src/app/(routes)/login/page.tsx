"use client";

import GoogleButton from "@/shared/components/GoogleButton";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

type FormData = {
  email: string;
  password: string;
};

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [rememberMe, setRememberMe] = useState(false);
  // const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit = (data: FormData) => {};

  return (
    <div className="w-full py-10 min-h-[85vh] bg-white-light">
      <h1 className="text-4xl font-Poppins font-semibold text-black text-center">
        Login
      </h1>
      <p className="text-center text-lg font-medium py-3 text-[#00000099]">
        Home . Login
      </p>

      <div className="w-full flex justify-center">
        <div className="md:w-[480px] p-8 bg-white shadow rounded-lg">
          <h3 className="text-3xl font-semibold text-center mb-2">
            Login to Eshop
          </h3>
          <p className="text-center text-gray-500 mb-4">
            Don't have an account?{" "}
            <Link href={"/signup"} className="text-blue-500">
              Sign up
            </Link>
          </p>

          <GoogleButton />
        </div>
      </div>
    </div>
  );
};

export default Login;
