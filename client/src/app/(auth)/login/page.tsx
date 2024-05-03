"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useState } from "react";
// @ts-ignore
import toast from "react-hot-toast";
import { auth_constants } from "../auth_constants";

const page = () => {
  const router = useRouter();
  const callbackUrl = useSearchParams().get("callbackUrl") || "";
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    setError("");
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError(auth_constants.login.ErrorEmailPasswordRequired);
      return;
    }
    const toastId = toast.loading(auth_constants.login.ToastSigningIn, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });

    try {
      const res = await signIn("credentials", {
        username: formData.username,
        password: formData.password,
        redirect: false,
        // redirect: true,
        callbackUrl: callbackUrl || "/",
      });
      console.log({ res });

      if (res?.error) {
        setError(res.error);
      } else if (res?.ok) {
        toast.success(auth_constants.login.ToastLoginSuccess);
        router.push(callbackUrl || "/");
      }
    } catch (error) {
      setError(auth_constants.login.ErrorInvalidCredentials);
    }

    toast.dismiss(toastId);
  };

  return (
    <div>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {auth_constants.login.LoginTitle}
          </CardTitle>
          <CardDescription>
            {auth_constants.login.LoginDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Error */}

            <div className="text-red-500 text-md h-5">{error}</div>
            <input type="hidden" name="callback" value={callbackUrl!} />
            <div className="space-y-2">
              <Label htmlFor="username">
                {auth_constants.login.LabelUsername}
              </Label>
              <Input
                id="username"
                name="username"
                placeholder={auth_constants.login.UsernamePlaceholder}
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {auth_constants.login.LabelPassword}
              </Label>
              <Input
                id="password"
                name="password"
                value={formData.password}
                placeholder={auth_constants.login.PasswordPlaceholder}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
              />
            </div>
            <Button className="w-full" type="submit">
              {auth_constants.login.ButtonLogin}
            </Button>
                
            <div className="mt-3">
              {auth_constants.login.LinkRegisterText}
              <Link href={"/register"} className="mx-1  text-accent-foreground">
                {auth_constants.login.LinkRegister}
              </Link>
          </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
