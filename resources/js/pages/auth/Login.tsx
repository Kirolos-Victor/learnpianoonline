import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { Heart, LoaderCircle, Music, Sparkles, Star } from 'lucide-react';
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
        <div className="bg-auth-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-6">
            {/* Animated Background Elements */}
            <div className="pointer-events-none absolute inset-0">
                {/* Floating Music Notes */}
                <div className="animate-float-slow absolute top-20">
                    <Music className="h-8 w-8 text-white/20" />
                </div>
                <div className="animate-float-medium absolute top-40 right-20">
                    <Music className="h-6 w-6 text-white/30" />
                </div>
                <div className="animate-float-fast absolute bottom-32">
                    <Music className="h-10 w-10 text-white/25" />
                </div>
                <div className="animate-float-slow absolute top-60 left-1/4">
                    <Music className="h-7 w-7 text-white/15" />
                </div>
                <div className="animate-float-medium absolute right-1/4 bottom-20">
                    <Music className="h-5 w-5 text-white/35" />
                </div>

                {/* Floating Stars */}
                <div className="animate-float-fast absolute top-32 right-10">
                    <Star className="h-4 w-4 fill-current text-yellow-300" />
                </div>
                <div className="animate-float-slow absolute bottom-40 left-1/3">
                    <Star className="h-6 w-6 fill-current text-yellow-200" />
                </div>
                <div className="animate-float-medium absolute top-80 right-1/4">
                    <Star className="h-3 w-3 fill-current text-yellow-400" />
                </div>

                {/* Floating Hearts */}
                <div className="animate-float-medium absolute top-24 left-1/4">
                    <Heart className="h-5 w-5 fill-current text-pink-300" />
                </div>
                <div className="animate-float-slow absolute right-16 bottom-60">
                    <Heart className="h-4 w-4 fill-current text-pink-200" />
                </div>
                <div className="animate-float-fast absolute top-72">
                    <Heart className="h-6 w-6 fill-current text-pink-400" />
                </div>

                {/* Floating Sparkles */}
                <div className="animate-float-fast absolute top-48 right-1">
                    <Sparkles className="h-4 w-4 text-blue-300/40" />
                </div>
                <div className="animate-float-slow absolute bottom-32 left-1/4">
                    <Sparkles className="h-5 w-5 text-blue-200/30" />
                </div>
                <div className="animate-float-medium absolute top-96 right-20">
                    <Sparkles className="h-3 w-3 text-blue-400/35" />
                </div>

                {/* Additional Music Icons */}
                <div className="animate-float-slow absolute top-16 right-1/4">
                    <div className="text-2xl text-white/20">♪</div>
                </div>
                <div className="animate-float-medium absolute bottom-48">
                    <div className="text-xl text-white/25">♫</div>
                </div>
                <div className="animate-float-fast absolute top-32 left-1">
                    <div className="text-3xl text-white/15">♩</div>
                </div>
                <div className="animate-float-slow absolute right-10 bottom-16">
                    <div className="text-lg text-white/30">♬</div>
                </div>
            </div>

            <Head>
                <title>Login - Learn Piano Online</title>
                <meta
                    name="description"
                    content="Sign in to your piano lesson account. Access your personalized lessons, custom homework assignments, and progress tracking dashboard."
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

            <div className="relative z-10 w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href={route('home.index')} className="flex cursor-pointer justify-center">
                        <Logo size="lg" className="justify-center" />
                    </Link>
                </div>

                <Card className="border-primary/20 bg-white/95 shadow-2xl backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-center font-fredoka text-2xl text-primary">Welcome Back</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">Sign in to continue your piano journey</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="font-medium text-primary">
                                    Email
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="border-input focus:border-primary"
                                />
                                <InputError message={errors.email} />
                            </div>
                            <div>
                                <Label htmlFor="password" className="font-medium text-primary">
                                    Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your password"
                                    className="border-input focus:border-primary"
                                />
                                <InputError message={errors.password} />
                            </div>
                            <div className="flex items-center space-x-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <Label htmlFor="remember" className="text-foreground">
                                    Remember me
                                </Label>
                            </div>
                            <Button
                                type="submit"
                                className="w-full bg-accent text-accent-foreground transition-all duration-300 hover:bg-accent/90"
                                disabled={processing}
                            >
                                {processing && <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />}
                                <Music className="mr-2 h-4 w-4" /> Sign In
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="cursor-pointer text-primary hover:underline">
                                    Sign up here
                                </Link>
                            </p>
                            <p className="mt-2 text-sm text-muted-foreground">
                                Forgot your password?{' '}
                                <Link href={route('password.request')} className="cursor-pointer text-primary hover:underline">
                                    Reset it here
                                </Link>
                            </p>
                            <p className="mt-3 text-xs text-muted-foreground">🔒 Secure & encrypted</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                @keyframes float-slow {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                @keyframes float-medium {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-15px) rotate(-3deg); }
                }
                @keyframes float-fast {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-10px) rotate(2deg); }
                }
                @keyframes fade-in {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes slide-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-float-slow {
                    animation: float-slow 6s ease-in-out infinite;
                }
                .animate-float-medium {
                    animation: float-medium 4s ease-in-out infinite;
                }
                .animate-float-fast {
                    animation: float-fast 3s ease-in-out infinite;
                }
                .animate-fade-in {
                    animation: fade-in 1s ease-out;
                }
                .animate-slide-up {
                    animation: slide-up 0.8s ease-out;
                }
                .animate-fade-in-delay-1 {
                    animation: fade-in 0.6s ease-out 0.2s both;
                }
                .animate-fade-in-delay-2 {
                    animation: fade-in 0.6s ease-out 0.4s both;
                }
                .animate-fade-in-delay-3 {
                    animation: fade-in 0.6s ease-out 0.6s both;
                }
                .animate-fade-in-delay-4 {
                    animation: fade-in 0.6s ease-out 0.8s both;
                }
                .animate-fade-in-delay-5 {
                    animation: fade-in 0.6s ease-out 1s both;
                }
            `}</style>
        </div>
    );
};

export default Login;
