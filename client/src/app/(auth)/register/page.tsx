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
import { auth_constants } from "@/constants";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import toast from "react-hot-toast";

const page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    confirmPassword: "",
    fName: "",
    lName: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    if (!formData.username || !formData.password || !formData.confirmPassword) {
      setError(auth_constants.register.errorMessage);
      return;
    }

    if(formData.password.length < 6) {
      setError(auth_constants.register.passwordLengthMessage);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(auth_constants.register.passwordMismatchMessage);
      return;
    }
    const toastId = toast.loading(auth_constants.register.loadingMessage, {
      style: {
        borderRadius: "10px",
        background: "#333",
        color: "#fff",
      },
    });
    setLoading(true);

    try {
      const { data } = await axios.post("/api/auth/register", formData);
      if (data) {
        toast.success(auth_constants.register.successMessage);
        router.push("/login");
      }
    } catch (error: any) {
      setError(error.response.data.message);
    } finally {
      setLoading(false);
    }
    toast.dismiss(toastId);
  };
  return (
    <div>
      <Card className="mx-auto max-w-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">
            {auth_constants.register.pageTitle}
          </CardTitle>
          <CardDescription>
            {auth_constants.register.pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Error */}

            <div className="text-red-500 text-md h-5">{error}</div>
            <div className="space-y-2">
              <Label htmlFor="fName">
                {auth_constants.register.firstNameLabel}
              </Label>
              <Input
                id="fName"
                name="fName"
                placeholder={auth_constants.register.firstNamePlaceholder}
                onChange={(e) =>
                  setFormData({ ...formData, fName: e.target.value })
                }
                value={formData.fName}
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lName">
                {auth_constants.register.lastNameLabel}
              </Label>
              <Input
                id="lName"
                name="lName"
                placeholder={auth_constants.register.lastNamePlaceholder}
                onChange={(e) =>
                  setFormData({ ...formData, lName: e.target.value })
                }
                value={formData.lName}
                type="text"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">
                {auth_constants.register.emailLabel}
              </Label>
              <Input
                id="email"
                name="email"
                placeholder={auth_constants.register.emailPlaceholder}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                value={formData.username}
                type="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                {auth_constants.register.passwordLabel}
              </Label>
              <Input
                id="password"
                name="password"
                placeholder={auth_constants.register.passwordPlaceholder}
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                type="password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="Cpassword">
                {auth_constants.register.confirmPasswordLabel}
              </Label>
              <Input
                id="Cpassword"
                name="Cpassword"
                placeholder={auth_constants.register.confirmPasswordPlaceholder}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                type="password"
              />
            </div>
            <Button className="w-full" type="submit">
              {loading
                ? auth_constants.register.loadingButton
                : auth_constants.register.registerButton}
            </Button>

            <div className="mt-3">
              {auth_constants.register.LinkRegisterText}{" "}
              <Link href={"/login"} className="mx-1  text-accent-foreground">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default page;
