import AnimatedAuthBackground from '@/components/AnimatedAuthBackground';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, LoaderCircle, Lock } from 'lucide-react';
import { FormEventHandler } from 'react';

type ResetPasswordForm = {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
};

interface Props {
    token: string;
    email: string;
}

const ResetPassword = ({ token, email }: Props) => {
    const { data, setData, post, processing, errors } = useForm<ResetPasswordForm>({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('password.store'));
    };

    return (
        <div className="bg-piano-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-6">
            <Head>
                <title>Reset Password - Learn Piano Online</title>
                <meta name="description" content="Set a new password for your piano lessons account." />
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
                        <h1 className="mb-2 font-fredoka text-3xl font-bold text-white">🔐 New Password</h1>
                        <p className="font-comic text-lg text-white/90">Create a secure new password</p>
                    </div>
                </div>

                {/* Reset Password Form */}
                <Card className="border-teal/20 bg-white/95 shadow-2xl backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-playfair text-navy text-center text-2xl">Set New Password</CardTitle>
                        <CardDescription className="text-warm-gray-600 text-center">Enter your new password below 🔑</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="email" className="text-navy font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    className="border-warm-gray-300 focus:border-teal mt-1 bg-gray-50"
                                    disabled
                                />
                            </div>

                            <div>
                                <Label htmlFor="password" className="text-navy font-medium">
                                    New Password
                                </Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Enter your new password"
                                    className="border-warm-gray-300 focus:border-teal mt-1"
                                    autoFocus
                                />
                                <InputError message={errors.password} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="password_confirmation" className="text-navy font-medium">
                                    Confirm Password
                                </Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm your new password"
                                    className="border-warm-gray-300 focus:border-teal mt-1"
                                />
                                <InputError message={errors.password_confirmation} className="mt-1" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-teal-400 text-white shadow-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-xl"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Updating Password...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="mr-2 h-4 w-4" />
                                        Update Password 🔐
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

                .animate-fade-in {
                    animation: fade-in 0.6s ease-out forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
};

export default ResetPassword;
