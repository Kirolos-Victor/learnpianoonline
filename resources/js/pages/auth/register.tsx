import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { Globe, LoaderCircle, Lock, Mail, MapPin, MessageCircle, Phone, Piano, Shield, User } from 'lucide-react';
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
}

const Register = ({ countries }: Props) => {
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
    const [currentStep, setCurrentStep] = useState(1);

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
        fetchLocations(countryCode);
        fetchPhoneCode(countryCode);
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    const canProceedToStep2 = data.name && data.email && data.password && data.password_confirmation;
    const canProceedToStep3 = canProceedToStep2 && data.country;

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4">
            <Head>
                <title>Register - Learn Piano Online</title>
                <meta
                    name="description"
                    content="Start your piano learning journey today! Sign up for live 1-on-1 piano lessons with professional teachers. Personalized curriculum and flexible scheduling."
                />
                <meta
                    name="keywords"
                    content="piano lesson registration, sign up piano lessons, piano student registration, online piano lessons signup"
                />
                <meta property="og:title" content="Register - Learn Piano Online" />
                <meta property="og:description" content="Start your piano learning journey today! Sign up for live 1-on-1 piano lessons." />
                <meta property="og:type" content="website" />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content="Register - Learn Piano Online" />
                <meta name="twitter:description" content="Start your piano learning journey today!" />
                <meta name="robots" content="noindex, nofollow" />
            </Head>

            <div className="w-full max-w-2xl">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Link href={route('home.index')} className="inline-flex items-center space-x-3 transition-opacity hover:opacity-80">
                        <div className="rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 p-3 shadow-lg">
                            <Piano className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-3xl font-bold text-transparent">
                                mypianoclass.net
                            </h1>
                            <p className="text-sm text-gray-600">Start your musical journey</p>
                        </div>
                    </Link>
                </div>

                {/* Progress Steps */}
                <div className="mb-8">
                    <div className="flex items-center justify-center space-x-4">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="flex items-center">
                                <div
                                    className={`flex h-10 w-10 items-center justify-center rounded-full font-semibold transition-all ${
                                        currentStep >= step
                                            ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                                            : 'bg-gray-200 text-gray-500'
                                    }`}
                                >
                                    {step}
                                </div>
                                {step < 3 && (
                                    <div
                                        className={`mx-2 h-1 w-16 transition-all ${
                                            currentStep > step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-200'
                                        }`}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 flex justify-center space-x-8">
                        <span className={`text-sm font-medium ${currentStep >= 1 ? 'text-purple-600' : 'text-gray-400'}`}>Personal Info</span>
                        <span className={`text-sm font-medium ${currentStep >= 2 ? 'text-purple-600' : 'text-gray-400'}`}>Location</span>
                        <span className={`text-sm font-medium ${currentStep >= 3 ? 'text-purple-600' : 'text-gray-400'}`}>Contact</span>
                    </div>
                </div>

                {/* Form Card */}
                <Card className="overflow-hidden border-0 shadow-2xl">
                    <CardHeader className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                        <CardTitle className="text-center text-2xl font-bold">
                            {currentStep === 1 && "Let's get started!"}
                            {currentStep === 2 && 'Where are you located?'}
                            {currentStep === 3 && 'Almost there!'}
                        </CardTitle>
                        <CardDescription className="text-center text-purple-100">
                            {currentStep === 1 && 'Create your account to begin learning piano'}
                            {currentStep === 2 && 'This helps us schedule lessons in your timezone'}
                            {currentStep === 3 && 'Add your contact info to complete registration'}
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="p-8">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Step 1: Personal Information */}
                            {currentStep === 1 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="name" className="flex items-center space-x-2 font-medium text-gray-700">
                                                <User className="h-4 w-4" />
                                                <span>Full Name</span>
                                            </Label>
                                            <Input
                                                id="name"
                                                type="text"
                                                value={data.name}
                                                onChange={(e) => setData('name', e.target.value)}
                                                placeholder="Enter your full name"
                                                className="mt-2 h-12 border-2 transition-colors focus:border-purple-500"
                                                required
                                            />
                                            <InputError message={errors.name} className="mt-1" />
                                        </div>

                                        <div>
                                            <Label htmlFor="email" className="flex items-center space-x-2 font-medium text-gray-700">
                                                <Mail className="h-4 w-4" />
                                                <span>Email Address</span>
                                            </Label>
                                            <Input
                                                id="email"
                                                type="email"
                                                value={data.email}
                                                onChange={(e) => setData('email', e.target.value)}
                                                placeholder="Enter your email address"
                                                className="mt-2 h-12 border-2 transition-colors focus:border-purple-500"
                                                required
                                            />
                                            <InputError message={errors.email} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                                            <div>
                                                <Label htmlFor="password" className="flex items-center space-x-2 font-medium text-gray-700">
                                                    <Lock className="h-4 w-4" />
                                                    <span>Password</span>
                                                </Label>
                                                <Input
                                                    id="password"
                                                    type="password"
                                                    value={data.password}
                                                    onChange={(e) => setData('password', e.target.value)}
                                                    placeholder="Create a secure password"
                                                    className="mt-2 h-12 border-2 transition-colors focus:border-purple-500"
                                                    required
                                                />
                                                <InputError message={errors.password} className="mt-1" />
                                            </div>

                                            <div>
                                                <Label
                                                    htmlFor="password_confirmation"
                                                    className="flex items-center space-x-2 font-medium text-gray-700"
                                                >
                                                    <Shield className="h-4 w-4" />
                                                    <span>Confirm Password</span>
                                                </Label>
                                                <Input
                                                    id="password_confirmation"
                                                    type="password"
                                                    value={data.password_confirmation}
                                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                                    placeholder="Confirm your password"
                                                    className="mt-2 h-12 border-2 transition-colors focus:border-purple-500"
                                                    required
                                                />
                                                <InputError message={errors.password_confirmation} className="mt-1" />
                                            </div>
                                        </div>
                                    </div>

                                    <Button
                                        type="button"
                                        onClick={() => setCurrentStep(2)}
                                        disabled={!canProceedToStep2}
                                        className="h-12 w-full rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white transition-all hover:from-purple-600 hover:to-pink-600"
                                    >
                                        Continue to Location
                                    </Button>
                                </div>
                            )}

                            {/* Step 2: Location Information */}
                            {currentStep === 2 && (
                                <div className="space-y-6">
                                    <div className="space-y-4">
                                        <div>
                                            <Label htmlFor="country" className="flex items-center space-x-2 font-medium text-gray-700">
                                                <Globe className="h-4 w-4" />
                                                <span>Country</span>
                                            </Label>
                                            <Select value={data.country} onValueChange={handleCountryChange}>
                                                <SelectTrigger className="mt-2 h-12 border-2 focus:border-purple-500">
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
                                                <Label htmlFor="state_province" className="flex items-center space-x-2 font-medium text-gray-700">
                                                    <MapPin className="h-4 w-4" />
                                                    <span>{locationLabel}</span>
                                                </Label>
                                                <Select
                                                    value={data.state_province}
                                                    onValueChange={(value) => setData('state_province', value)}
                                                    disabled={loadingLocations}
                                                >
                                                    <SelectTrigger className="mt-2 h-12 border-2 focus:border-purple-500">
                                                        <SelectValue
                                                            placeholder={
                                                                loadingLocations ? 'Loading...' : `Select your ${locationLabel.toLowerCase()}`
                                                            }
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
                                                <InputError message={errors.state_province} className="mt-1" />
                                            </div>
                                        )}

                                        <div>
                                            <Label htmlFor="city" className="flex items-center space-x-2 font-medium text-gray-700">
                                                <MapPin className="h-4 w-4" />
                                                <span>City (Optional)</span>
                                            </Label>
                                            <Input
                                                id="city"
                                                type="text"
                                                value={data.city}
                                                onChange={(e) => setData('city', e.target.value)}
                                                placeholder="Enter your city"
                                                className="mt-2 h-12 border-2 transition-colors focus:border-purple-500"
                                            />
                                            <InputError message={errors.city} className="mt-1" />
                                        </div>
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentStep(1)}
                                            variant="outline"
                                            className="h-12 flex-1 border-2 hover:bg-gray-50"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentStep(3)}
                                            disabled={!canProceedToStep3}
                                            className="h-12 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:from-purple-600 hover:to-pink-600"
                                        >
                                            Continue to Contact
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {/* Step 3: Contact Information */}
                            {currentStep === 3 && (
                                <div className="space-y-6">
                                    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                                        <div className="flex items-center space-x-2 text-blue-700">
                                            <MessageCircle className="h-5 w-5" />
                                            <span className="font-medium">WhatsApp Contact (Optional)</span>
                                        </div>
                                        <p className="mt-2 text-sm text-blue-600">
                                            We'll use this to send you lesson reminders and updates. You can skip this step if you prefer.
                                        </p>
                                    </div>

                                    <div>
                                        <Label htmlFor="whatsapp_number" className="flex items-center space-x-2 font-medium text-gray-700">
                                            <Phone className="h-4 w-4" />
                                            <span>WhatsApp Number</span>
                                        </Label>
                                        <div className="mt-2 flex">
                                            <div className="flex min-w-[80px] items-center justify-center rounded-l-lg border-2 border-r-0 border-gray-300 bg-gray-50 px-3 text-sm font-medium text-gray-600">
                                                {loadingPhoneCode ? '...' : phoneCode}
                                            </div>
                                            <Input
                                                id="whatsapp_number"
                                                type="tel"
                                                value={data.whatsapp_number}
                                                onChange={(e) => setData('whatsapp_number', e.target.value)}
                                                placeholder="Enter phone number"
                                                className="h-12 rounded-l-none border-2 border-l-0 transition-colors focus:border-purple-500"
                                            />
                                        </div>
                                        <InputError message={errors.whatsapp_number} className="mt-1" />
                                    </div>

                                    <div className="flex space-x-4">
                                        <Button
                                            type="button"
                                            onClick={() => setCurrentStep(2)}
                                            variant="outline"
                                            className="h-12 flex-1 border-2 hover:bg-gray-50"
                                        >
                                            Back
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={processing}
                                            className="h-12 flex-1 bg-gradient-to-r from-purple-500 to-pink-500 font-semibold text-white hover:from-purple-600 hover:to-pink-600"
                                        >
                                            {processing ? (
                                                <>
                                                    <LoaderCircle className="mr-2 h-5 w-5 animate-spin" />
                                                    Creating Account...
                                                </>
                                            ) : (
                                                'Create Account'
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>

                        {/* Footer */}
                        <div className="mt-8 border-t border-gray-200 pt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium text-purple-600 transition-colors hover:text-purple-800 hover:underline"
                                >
                                    Sign in here
                                </Link>
                            </p>
                            <div className="mt-4 flex items-center justify-center space-x-4 text-sm text-gray-500">
                                <div className="flex items-center space-x-1">
                                    <Shield className="h-4 w-4" />
                                    <span>Secure & encrypted</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Piano className="h-4 w-4" />
                                    <span>Professional teachers</span>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
