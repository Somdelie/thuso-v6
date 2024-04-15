import UserForm from "@/components/auth/register/UserForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { FcGoogle } from "react-icons/fc";

const Register = () => {
  return (
    <Card className="mx-auto my-4 max-w-sm bg-gray-100 dark:bg-inherit sm:max-w-[650px] lg:w-[750px]">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          Create an account{" "}
          <Link href="/" className="flex items-center gap-1">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt={""}
              className="rounded"
            />
            <p className="text-[16px] text-sky-600 underline">Thuso.com</p>
          </Link>
        </CardTitle>
        <CardDescription>
          Enter your details below to register to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UserForm />
        <div className="grid mt-4 sm:grid-cols-2 items-center gap-2 w-full">
          <Button variant="outline" className="w-full gap-2">
            <FcGoogle size={24} /> Login with Google
          </Button>
          <Link
            href="/auth/work-with-us"
            className="border border-input shrink w-full rounded-md lg:px-4 sm:px-3 whitespace-nowrap transition-colors h-10 px-4 py-2 bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Register as Freelancer
          </Link>
        </div>
        <div className="mt-4 text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/login" className="underline text-sky-400">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default Register;
