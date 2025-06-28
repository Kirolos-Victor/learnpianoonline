import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { FormEventHandler } from 'react';

type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

const Login = () => {
    const { data, setData, post, processing, errors, reset } = useForm<Required<LoginForm>>({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <div className="bg-piano-gradient flex min-h-screen items-center justify-center px-6">
            <Head title="Log in" />
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <a href={route('home.index')} className="flex justify-center cursor-pointer">
                        <Logo size="lg" className="justify-center" />
                    </a>
                </div>

                <Card className="border-teal/20 bg-white shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-center font-playfair text-2xl text-navy">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-warm-gray-600">Sign in to continue your piano journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-navy">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="border-warm-gray-300 focus:border-teal"
                                    required
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="password" className="text-navy">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="border-warm-gray-300 focus:border-teal"
                                    required
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onClick={() => setData('remember', !data.remember)}
                                />
                                <Label htmlFor="remember">Remember me</Label>
                            </div>
                            <Button type="submit" className="w-full bg-teal-400 text-white hover:bg-teal-600" disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-warm-gray-600">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-teal hover:underline cursor-pointer">
                                    Sign up here
                                </Link>
                            </p>
                            <p className="mt-2 text-xs text-warm-gray-500">🔒 Secure & encrypted</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
