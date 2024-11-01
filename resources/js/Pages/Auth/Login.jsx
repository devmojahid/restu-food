import { useEffect, useState } from "react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Head, Link, useForm } from "@inertiajs/react";
import { Card } from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Facebook, Github } from "lucide-react";
import BlankLayout from "@/Layouts/Blank/BlankLayout";

export default function Login({ status, canResetPassword }) {
  const [isLoading, setIsLoading] = useState(false);
  const { data, setData, post, processing, errors, reset } = useForm({
    email: "",
    password: "",
    remember: false,
  });

  useEffect(() => {
    return () => {
      reset("password");
    };
  }, []);

  const submit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    post(route("login"), {
      onSuccess: () => setIsLoading(false),
      onError: () => setIsLoading(false),
    });
  };

  return (
    <BlankLayout>
      <Head title="Log in" />

      {status && (
        <div className="mb-4 font-medium text-sm text-green-600">{status}</div>
      )}

      <div className="container grid h-svh flex-col items-center justify-center bg-primary-foreground lg:max-w-none lg:px-0">
        <div className="mx-auto flex w-full flex-col justify-center space-y-2 sm:w-[480px] lg:p-8">
          <div className="mb-4 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            <h1 className="text-xl font-medium">Shadcn Admin</h1>
          </div>
          <Card className="p-6">
            <div className="flex flex-col space-y-2 text-left mb-2">
              <h1 className="text-2xl font-semibold tracking-tight">Login</h1>
              <p className="text-sm text-muted-foreground">
                Enter your email and password below <br />
                to log into your account
              </p>
            </div>
            <form onSubmit={submit}>
              <div className="grid gap-2">
                <div>
                  <InputLabel htmlFor="email" value="Email" />
                  <Input
                    placeholder="name@example.com"
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    autoComplete="username"
                    onChange={(e) => setData("email", e.target.value)}
                  />
                  <InputError message={errors.email} className="mt-2" />
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <InputLabel htmlFor="password" value="Password" />
                    <Link
                      href={route("password.request")}
                      className="text-sm font-medium text-muted-foreground hover:opacity-75"
                    >
                      Forgot your password?
                    </Link>
                  </div>
                  <Input
                    placeholder="********"
                    id="password"
                    type="password"
                    name="password"
                    value={data.password}
                    className="mt-1 block w-full"
                    autoComplete="current-password"
                    onChange={(e) => setData("password", e.target.value)}
                  />
                  <InputError message={errors.password} className="mt-2" />
                </div>

                <Button className="mt-2" loading={isLoading}>
                  Login
                </Button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    loading={isLoading}
                    leftSection={<Github className="h-4 w-4" />}
                  >
                    GitHub
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    type="button"
                    loading={isLoading}
                    leftSection={<Facebook className="h-4 w-4" />}
                  >
                    Facebook
                  </Button>
                </div>
              </div>
            </form>
            <p className="mt-4 px-8 text-center text-sm text-muted-foreground">
              By clicking login, you agree to our{" "}
              <a
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </Card>
        </div>
      </div>
    </BlankLayout>
  );
}
