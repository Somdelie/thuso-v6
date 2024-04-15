"use client";
import Login from "@/components/auth/login/Login";
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
import { FcGoogle } from "react-icons/fc";

const LoginPage = () => {
  return (
    <Card className=" max-w-sm bg-gray-100 dark:bg-inherit">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center justify-between">
          Login{" "}
          <Link href="/">
            <Image
              src="/logo.png"
              width={40}
              height={40}
              alt={""}
              className="rounded"
            />
          </Link>
        </CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <Login />
          <Button variant="outline" className="w-full gap-2">
            <FcGoogle size={24} /> Login with Google
          </Button>
        </div>
        <div className="mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="underline">
            Register
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default LoginPage;
