import AnimatedAuthBackground from '@/components/AnimatedAuthBackground';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Mail } from 'lucide-react';
import { FormEventHandler } from 'react';

type ForgotPasswordForm = {
    email: string;
};

interface Props {
    status?: string;
}

const ForgotPassword = ({ status }: Props) => {
    const { data, setData, post, processing, errors } = useForm<ForgotPasswordForm>({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="bg-piano-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-6">
            <Head>
                <title>Forgot Password - Learn Piano Online</title>
                <meta name="description" content="Reset your password to regain access to your piano lessons account." />
                <meta name="keywords" content="forgot password, reset password, piano lessons, account recovery" />
                <meta property="og:title" content="Forgot Password - Learn Piano Online" />
                <meta property="og:description" content="Reset your password to regain access to your piano lessons account." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Forgot Password - Learn Piano Online" />
                <meta name="twitter:description" content="Reset your password to regain access to your account." />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <AnimatedAuthBackground />

            <div className="relative z-10 w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Link href={route('home.index')} className="flex cursor-pointer justify-center">
                        <Logo size="lg" className="justify-center" />
                    </Link>
                    <div className="mt-4">
                        <h1 className="mb-2 font-fredoka text-3xl font-bold text-white">🔑 Forgot Password?</h1>
                        <p className="font-comic text-lg text-white/90">No worries! We'll help you get back in</p>
                    </div>
                </div>

                {/* Forgot Password Form */}
                <Card className="border-teal/20 bg-white/95 shadow-2xl backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-playfair text-navy text-center text-2xl">Reset Your Password</CardTitle>
                        <CardDescription className="text-warm-gray-600 text-center">
                            Enter your email address and we'll send you a link to reset your password 📧
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {status && (
                            <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <Mail className="h-5 w-5 text-green-400" />
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-green-800">{status}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-navy font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email address"
                                    className="border-warm-gray-300 focus:border-teal mt-1"
                                    autoFocus
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-teal-400 text-white shadow-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-xl"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Sending Reset Link...
                                    </>
                                ) : (
                                    <>
                                        <Mail className="mr-2 h-4 w-4" />
                                        Send Reset Link 📬
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-warm-gray-600 text-sm">
                                Remember your password?{' '}
                                <Link href={route('login')} className="text-teal cursor-pointer font-medium hover:underline">
                                    <ArrowLeft className="mr-1 inline h-3 w-3" />
                                    Back to login
                                </Link>
                            </p>
                            <p className="text-warm-gray-600 mt-2 text-sm">
                                Don't have an account?{' '}
                                <Link href={route('register')} className="text-teal cursor-pointer font-medium hover:underline">
                                    Sign up here
                                </Link>
                            </p>
                            <p className="text-warm-gray-500 mt-3 text-xs">🔒 Secure & encrypted • 🎵 Get back to learning!</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <style>{`
                @keyframes fade-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                @keyframes slide-up {
                    from {
                        opacity: 0;
                        transform: translateY(40px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }

                .animate-slide-up {
                    animation: slide-up 0.8s ease-out forwards;
                }
            `}</style>
        </div>
    );
};

export default ForgotPassword;
