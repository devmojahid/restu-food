import { Head, useForm } from '@inertiajs/react';
import BlankLayout from '@/Layouts/Blank/BlankLayout';
import { Card } from '@/Components/ui/card';
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import { Input } from "@/Components/ui/input";
import { Button } from '@/Components/ui/button';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <BlankLayout>
            <Head title="Forgot Password" />
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
                            <h1 className="text-2xl font-semibold tracking-tight">Forgot Password</h1>
                            <p className="text-sm text-muted-foreground">
                                Forgot your password? No problem. Just let us know your email
                            </p>
                        </div>

                        {status && (
                            <div className="mb-4 text-sm font-medium text-green-600">
                                {status}
                            </div>
                        )}

                        <form onSubmit={submit}>
                            <InputLabel htmlFor="email" value="Email" />
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email || ''}
                                className="mt-1 block w-full"
                                isFocused={true}
                                autoComplete="username"
                                required
                                placeholder="name@example.com"
                                onChange={(e) => setData('email', e.target.value)}
                            />

                            <InputError message={errors.email} className="mt-2" />

                            <div className="mt-4 flex items-center justify-end">
                                <Button
                                    className="mt-2"
                                    loading={processing}
                                >
                                    Email Password Reset Link
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </BlankLayout>
    );
}
