import AnimatedAuthBackground from '@/components/AnimatedAuthBackground';
import Logo from '@/components/Logo';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
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
            const response = await fetch(`/locations?country=${countryCode}`);
            const data = await response.json();

            setLocations(data.locations || {});
            setShowLocationDropdown(Object.keys(data.locations || {}).length > 0);

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
            const response = await fetch(`/phone-code?country=${countryCode}`);
            const data = await response.json();
            setPhoneCode(data.phone_code || '+1');
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
        <div className="bg-piano-gradient relative flex min-h-screen items-center justify-center overflow-hidden px-6">
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
                <Card className="border-teal/20 bg-white/95 shadow-2xl backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle className="font-playfair text-navy text-center text-2xl">Create Your Account</CardTitle>
                        <CardDescription className="text-warm-gray-600 text-center">
                            Join thousands of students learning piano online! 🎵
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Personal Information */}
                            <div>
                                <Label htmlFor="name" className="text-navy font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="border-warm-gray-300 focus:border-teal mt-1"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="email" className="text-navy font-medium">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="border-warm-gray-300 focus:border-teal mt-1"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password" className="text-navy font-medium">
                                        Password
                                    </Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Create a password"
                                        className="border-warm-gray-300 focus:border-teal mt-1"
                                        required
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
                                        placeholder="Confirm password"
                                        className="border-warm-gray-300 focus:border-teal mt-1"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>
                            </div>

                            {/* Location Information */}
                            <div>
                                <Label htmlFor="country" className="text-navy font-medium">
                                    Country
                                </Label>
                                <Select value={data.country} onValueChange={handleCountryChange}>
                                    <SelectTrigger className="border-warm-gray-300 focus:border-teal mt-1">
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
                                    <Label htmlFor="state_province" className="text-navy font-medium">
                                        {locationLabel}
                                        {isStateRequired && <span className="ml-1 text-red-500">*</span>}
                                    </Label>
                                    <Select
                                        value={data.state_province}
                                        onValueChange={(value) => setData('state_province', value)}
                                        disabled={loadingLocations}
                                    >
                                        <SelectTrigger className="border-warm-gray-300 focus:border-teal mt-1">
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
                                    {isStateRequired && <p className="mt-1 text-xs text-gray-600">Required for accurate timezone detection</p>}
                                    <InputError message={errors.state_province} className="mt-1" />
                                </div>
                            )}

                            <div>
                                <Label htmlFor="city" className="text-navy font-medium">
                                    City (Optional)
                                </Label>
                                <Input
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Enter your city"
                                    className="border-warm-gray-300 focus:border-teal mt-1"
                                />
                                <InputError message={errors.city} className="mt-1" />
                            </div>

                            {/* Contact Information */}
                            <div>
                                <Label htmlFor="whatsapp_number" className="text-navy font-medium">
                                    WhatsApp Number (Optional)
                                </Label>
                                <div className="mt-1 flex">
                                    <div className="border-warm-gray-300 flex min-w-[80px] items-center justify-center rounded-l-md border border-r-0 bg-gray-50 px-3 text-sm text-gray-600">
                                        {loadingPhoneCode ? '...' : phoneCode}
                                    </div>
                                    <Input
                                        id="whatsapp_number"
                                        type="tel"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        placeholder="Phone number"
                                        className="border-warm-gray-300 focus:border-teal rounded-l-none border-l-0"
                                    />
                                </div>
                                <InputError message={errors.whatsapp_number} className="mt-1" />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-teal-400 text-white shadow-lg transition-all duration-300 hover:bg-teal-600 hover:shadow-xl"
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
                            <p className="text-warm-gray-600 text-sm">
                                Already have an account?{' '}
                                <Link href={route('login')} className="text-teal cursor-pointer font-medium hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                            <p className="text-warm-gray-500 text-xs">🔒 Secure & encrypted • 🎵 Start learning today!</p>
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
