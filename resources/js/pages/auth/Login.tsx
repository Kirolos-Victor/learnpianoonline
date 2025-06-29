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
            <Head>
                <title>Login - Learn Piano Online</title>
                <meta
                    name="description"
                    content="Sign in to your piano lesson account. Access your personalized lessons, homework assignments, and progress tracking dashboard."
                />
                <meta name="keywords" content="piano lesson login, sign in piano lessons, piano student login, online piano account" />
                <meta property="og:title" content="Login - Learn Piano Online" />
                <meta property="og:description" content="Sign in to your piano lesson account. Access your personalized lessons and progress." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Login - Learn Piano Online" />
                <meta name="twitter:description" content="Sign in to your piano lesson account." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href={route('home.index')} className="flex cursor-pointer justify-center">
                        <Logo size="lg" className="justify-center" />
                    </Link>
                </div>

                <Card className="border-teal/20 bg-white shadow-xl">
                    <CardHeader>
                        <CardTitle className="font-playfair text-navy text-center text-2xl">Welcome Back</CardTitle>
                        <CardDescription className="text-warm-gray-600 text-center">Sign in to continue your piano journey</CardDescription>
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
                            <p className="text-warm-gray-600 text-sm">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-teal cursor-pointer hover:underline">
                                    Sign up here
                                </Link>
                            </p>
                            <p className="text-warm-gray-500 mt-2 text-xs">🔒 Secure & encrypted</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Login;
