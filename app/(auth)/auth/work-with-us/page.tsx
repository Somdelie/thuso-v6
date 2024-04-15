import UserForm from "@/components/auth/register/UserForm";
import VendorForm from "@/components/auth/register/VendorForm";
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
    <Card className="mx-auto my-4 bg-gray-100 dark:bg-inherit max-w-sm sm:max-w-[750px] lg:w-[850px]">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          Work with us{" "}
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
        <VendorForm />
        <div className="grid mt-4 sm:grid-cols-2 items-center gap-2 w-full">
          <Button variant="outline" className="w-full gap-2">
            <FcGoogle size={24} /> Login with Google
          </Button>
          <Link
            href="/auth/register"
            className="border border-input shrink w-full rounded-md lg:px-4 sm:px-3 whitespace-nowrap transition-colors h-10 px-4 py-2 bg-background hover:bg-accent hover:text-accent-foreground"
          >
            Register as Client
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
