import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import BlankLayout from '@/Layouts/Blank/BlankLayout';
import { Head, useForm } from '@inertiajs/react';
import { Card } from '@/Components/ui/card';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <BlankLayout>
            <Head title="Confirm Password" />

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
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Confirm Password
                            </h1>
                            <p className="text-sm text-muted-foreground">
                                Confinmm yourpaword
                            </p>
                        </div>
                        <div className="mb-4 text-sm text-gray-600">
                            This is a secure area of the application. Please confirm your
                            password before continuing.
                        </div>

                        <form onSubmit={submit}>
                            <div className="mt-4">
                                <InputLabel htmlFor="password" value="Password" />

                                <Input
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    isFocused={true}
                                    onChange={(e) => setData('password', e.target.value)}
                                />

                                <InputError message={errors.password} className="mt-2" />
                            </div>

                            <div className="mt-4 flex items-center justify-end">
                                <Button className="ms-4" disabled={processing}>
                                    Confirm
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </BlankLayout>
    );
}
