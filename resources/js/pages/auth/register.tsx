import AnimatedAuthBackground from '@/components/AnimatedAuthBackground';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import axios from 'axios';
import { LoaderCircle, Music } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
    whatsapp_number: string;
    city: string;
    state_province: string;
    country: string;
};

interface Props {
    countries: Record<string, string>;
    countriesRequiringState: string[];
}

const Register = ({ countries, countriesRequiringState }: Props) => {
    const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        whatsapp_number: '',
        city: '',
        state_province: '',
        country: '',
    });

    const [locations, setLocations] = useState<Record<string, string>>({});
    const [showLocationDropdown, setShowLocationDropdown] = useState(false);
    const [loadingLocations, setLoadingLocations] = useState(false);
    const [locationLabel, setLocationLabel] = useState('State/Province');
    const [phoneCode, setPhoneCode] = useState('+1');
    const [loadingPhoneCode, setLoadingPhoneCode] = useState(false);
    const [isStateRequired, setIsStateRequired] = useState(false);

    const fetchLocations = async (countryCode: string) => {
        if (!countryCode) return;

        setLoadingLocations(true);
        try {
            const response = await axios.get(`/locations?country=${countryCode}`);

            setLocations(response.data.locations || {});
            setShowLocationDropdown(Object.keys(response.data.locations || {}).length > 0);

            // Set appropriate label based on country
            if (countryCode === 'US') {
                setLocationLabel('State');
            } else if (countryCode === 'CA') {
                setLocationLabel('Province');
            } else if (countryCode === 'AU') {
                setLocationLabel('State/Territory');
            } else if (countryCode === 'GB') {
                setLocationLabel('Region');
            } else {
                setLocationLabel('City');
            }
        } catch (error) {
            console.error('Error fetching locations:', error);
            setLocations({});
            setShowLocationDropdown(false);
        } finally {
            setLoadingLocations(false);
        }
    };

    const fetchPhoneCode = async (countryCode: string) => {
        if (!countryCode) return;

        setLoadingPhoneCode(true);
        try {
            const response = await axios.get(`/phone-code?country=${countryCode}`);
            setPhoneCode(response.data.phone_code || '+1');
        } catch (error) {
            console.error('Error fetching phone code:', error);
            setPhoneCode('+1');
        } finally {
            setLoadingPhoneCode(false);
        }
    };

    const handleCountryChange = (countryCode: string) => {
        setData('country', countryCode);
        setData('state_province', ''); // Reset state/province when country changes
        setIsStateRequired(countriesRequiringState.includes(countryCode));
        fetchLocations(countryCode);
        fetchPhoneCode(countryCode);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="bg-auth-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-6">
            <Head>
                <title>Register - Learn Piano Online</title>
                <meta name="description" content="Create your account to start learning piano online with professional instructors." />
                <meta name="keywords" content="piano lesson register, sign up piano lessons, piano student registration, online piano account" />
                <meta property="og:title" content="Register - Learn Piano Online" />
                <meta property="og:description" content="Create your account to start learning piano online with professional instructors." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Register - Learn Piano Online" />
                <meta name="twitter:description" content="Create your account to start learning piano online." />
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
                        <h1 className="mb-2 font-fredoka text-3xl font-bold text-white">🎹 Join the Fun!</h1>
                        <p className="font-comic text-lg text-white/90">Start your musical adventure today</p>
                    </div>
                </div>

                {/* Registration Form */}
                <Card className="border-primary/20 bg-white/95 shadow-2xl backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="text-center font-fredoka text-2xl text-primary">Create Your Account</CardTitle>
                        <CardDescription className="text-center text-muted-foreground">
                            Join hundreds of kids learning piano online! 🎵
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Personal Information */}
                            <div>
                                <Label htmlFor="name" className="font-medium text-primary">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-1 border-input focus:border-primary"
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="email" className="font-medium text-primary">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="mt-1 border-input focus:border-primary"
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password" className="font-medium text-primary">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Create a password"
                                        className="mt-1 border-input focus:border-primary"
                                    />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>
                                <div>
                                    <Label htmlFor="password_confirmation" className="font-medium text-primary">
                                        Confirm Password
                                    </Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm password"
                                        className="mt-1 border-input focus:border-primary"
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>
                            </div>

                            {/* Location Information */}
                            <div>
                                <Label htmlFor="country" className="font-medium text-primary">
                                    Country
                                </Label>
                                <Select value={data.country} onValueChange={handleCountryChange}>
                                    <SelectTrigger className="mt-1 border-input focus:border-primary">
                                        <SelectValue placeholder="Select your country" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.entries(countries).map(([code, name]) => (
                                            <SelectItem key={code} value={code}>
                                                {name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <InputError message={errors.country} className="mt-1" />
                            </div>

                            {showLocationDropdown && (
                                <div>
                                    <Label htmlFor="state_province" className="font-medium text-primary">
                                        {locationLabel}
                                        {isStateRequired && <span className="ml-1 text-red-500">*</span>}
                                    </Label>
                                    <Select
                                        value={data.state_province}
                                        onValueChange={(value) => setData('state_province', value)}
                                        disabled={loadingLocations}
                                    >
                                        <SelectTrigger className="mt-1 border-input focus:border-primary">
                                            <SelectValue
                                                placeholder={loadingLocations ? 'Loading...' : `Select your ${locationLabel.toLowerCase()}`}
                                            />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(locations).map(([code, name]) => (
                                                <SelectItem key={code} value={code}>
                                                    {name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {isStateRequired && (
                                        <p className="mt-1 text-xs text-muted-foreground">Required for accurate timezone detection</p>
                                    )}
                                    <InputError message={errors.state_province} className="mt-1" />
                                </div>
                            )}

                            <div>
                                <Label htmlFor="city" className="font-medium text-primary">
                                    City (Optional)
                                </Label>
                                <Input
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Enter your city"
                                    className="mt-1 border-input focus:border-primary"
                                />
                                <InputError message={errors.city} className="mt-1" />
                            </div>

                            {/* Contact Information */}
                            <div>
                                <Label htmlFor="whatsapp_number" className="font-medium text-primary">
                                    WhatsApp Number (Optional)
                                </Label>
                                <div className="mt-1 flex">
                                    <div className="flex min-w-[80px] items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                        {loadingPhoneCode ? '...' : phoneCode}
                                    </div>
                                    <Input
                                        id="whatsapp_number"
                                        type="tel"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        placeholder="Phone number"
                                        className="rounded-l-none border-l-0 border-input focus:border-primary"
                                    />
                                </div>
                                <InputError message={errors.whatsapp_number} className="mt-1" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:bg-accent/90 hover:shadow-xl"
                                disabled={processing}
                            >
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <Music className="mr-2 h-4 w-4" />
                                        Start My Piano Journey! 🎹
                                    </>
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href={route('login')} className="cursor-pointer font-medium text-primary hover:underline">
                                    Sign in here
                                </Link>
                            </p>

                            <p className="mt-3 text-xs text-muted-foreground">🔒 Secure & encrypted • 🎵 Start learning today!</p>
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

export default Register;
