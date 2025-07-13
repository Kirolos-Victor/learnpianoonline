import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, Piano } from 'lucide-react';
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
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <Head>
                <title>Register - Learn Piano Online</title>
                <meta name="description" content="Create your account to start learning piano online with professional instructors." />
            </Head>

            <div className="w-full max-w-md">
                {/* Header */}
                <div className="mb-8 text-center">
                    <Link href={route('home.index')} className="inline-flex items-center space-x-2">
                        <Piano className="h-8 w-8 text-purple-600" />
                        <span className="text-2xl font-bold text-gray-900">Learn Piano Online</span>
                    </Link>
                    <p className="mt-2 text-gray-600">Create your account to get started</p>
                </div>

                {/* Registration Form */}
                <Card>
                    <CardHeader>
                        <CardTitle>Create Account</CardTitle>
                        <CardDescription>Fill in your details to register</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {/* Personal Information */}
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-1"
                                    required
                                />
                                <InputError message={errors.name} className="mt-1" />
                            </div>

                            <div>
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    className="mt-1"
                                    required
                                />
                                <InputError message={errors.email} className="mt-1" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Password"
                                        className="mt-1"
                                        required
                                    />
                                    <InputError message={errors.password} className="mt-1" />
                                </div>

                                <div>
                                    <Label htmlFor="password_confirmation">Confirm Password</Label>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Confirm password"
                                        className="mt-1"
                                        required
                                    />
                                    <InputError message={errors.password_confirmation} className="mt-1" />
                                </div>
                            </div>

                            {/* Location Information */}
                            <div>
                                <Label htmlFor="country">Country</Label>
                                <Select value={data.country} onValueChange={handleCountryChange}>
                                    <SelectTrigger className="mt-1">
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
                                    <Label htmlFor="state_province">
                                        {locationLabel}
                                        {isStateRequired && <span className="ml-1 text-red-500">*</span>}
                                    </Label>
                                    <Select
                                        value={data.state_province}
                                        onValueChange={(value) => setData('state_province', value)}
                                        disabled={loadingLocations}
                                    >
                                        <SelectTrigger className="mt-1">
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
                                <Label htmlFor="city">City (Optional)</Label>
                                <Input
                                    id="city"
                                    type="text"
                                    value={data.city}
                                    onChange={(e) => setData('city', e.target.value)}
                                    placeholder="Enter your city"
                                    className="mt-1"
                                />
                                <InputError message={errors.city} className="mt-1" />
                            </div>

                            {/* Contact Information */}
                            <div>
                                <Label htmlFor="whatsapp_number">WhatsApp Number (Optional)</Label>
                                <div className="mt-1 flex">
                                    <div className="flex min-w-[80px] items-center justify-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-600">
                                        {loadingPhoneCode ? '...' : phoneCode}
                                    </div>
                                    <Input
                                        id="whatsapp_number"
                                        type="tel"
                                        value={data.whatsapp_number}
                                        onChange={(e) => setData('whatsapp_number', e.target.value)}
                                        placeholder="Phone number"
                                        className="rounded-l-none border-l-0"
                                    />
                                </div>
                                <InputError message={errors.whatsapp_number} className="mt-1" />
                            </div>

                            <Button type="submit" className="w-full" disabled={processing}>
                                {processing ? (
                                    <>
                                        <LoaderCircle className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link href={route('login')} className="font-medium text-purple-600 hover:text-purple-500">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
