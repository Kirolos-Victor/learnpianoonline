import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import InputError from '@/components/ui/input-error';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Head, Link, useForm } from '@inertiajs/react';
import { LoaderCircle, MapPin, MessageCircle, Piano } from 'lucide-react';
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
    const { data, setData, post, processing, errors, reset } = useForm<Required<RegisterForm>>({
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

    return (
        <div className="bg-piano-gradient flex min-h-screen items-center justify-center px-6 py-12">
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
            <div className="w-full max-w-md">
                <div className="mb-8 text-center">
                    <Link href={'home.index'} className="inline-flex cursor-pointer items-center space-x-2">
                        <Piano className="text-warm-brown h-8 w-8" />
                        <span className="font-playfair text-2xl font-bold text-primary">mypianoclass.net</span>
                    </Link>
                </div>

                <Card className="border-gold/20 shadow-xl">
                    <CardHeader>
                        <CardTitle className="font-playfair text-center text-2xl">Start Your Piano Journey</CardTitle>
                        <CardDescription className="text-center">Create your account and begin learning piano today</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="Enter your full name"
                                    required
                                />
                                <InputError message={errors.name} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                />
                                <InputError message={errors.email} className="mt-2" />
                            </div>

                            {/* Location Section */}
                            <div className="mt-6 space-y-3 border-t pt-4">
                                <div className="mb-3 flex items-center space-x-2">
                                    <MapPin className="text-warm-brown h-4 w-4" />
                                    <Label className="text-base font-medium">Location Information</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">This helps us schedule lessons in your timezone.</p>

                                <div>
                                    <Label htmlFor="country">Country *</Label>
                                    <Select value={data.country} onValueChange={handleCountryChange}>
                                        <SelectTrigger>
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
                                    <InputError message={errors.country} className="mt-2" />
                                </div>

                                {showLocationDropdown && (
                                    <div>
                                        <Label htmlFor="state_province">
                                            {locationLabel} {Object.keys(locations).length > 0 ? '*' : ''}
                                        </Label>
                                        <Select
                                            value={data.state_province}
                                            onValueChange={(value) => setData('state_province', value)}
                                            disabled={loadingLocations}
                                        >
                                            <SelectTrigger>
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
                                        <InputError message={errors.state_province} className="mt-2" />
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
                                    />
                                    <InputError message={errors.city} className="mt-2" />
                                </div>
                            </div>

                            {/* WhatsApp Number Section */}
                            <div className="mt-6 space-y-3 border-t pt-4">
                                <div className="mb-3 flex items-center space-x-2">
                                    <MessageCircle className="text-warm-brown h-4 w-4" />
                                    <Label className="text-base font-medium">WhatsApp Contact</Label>
                                </div>
                                <p className="text-sm text-muted-foreground">We'll use this to communicate about your lessons.</p>

                                <div>
                                    <Label htmlFor="whatsapp_number">WhatsApp Number *</Label>
                                    <div className="flex">
                                        <div className="flex min-w-[60px] items-center justify-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
                                            {loadingPhoneCode ? '...' : phoneCode}
                                        </div>
                                        <Input
                                            id="whatsapp_number"
                                            type="tel"
                                            value={data.whatsapp_number}
                                            onChange={(e) => setData('whatsapp_number', e.target.value)}
                                            placeholder="Enter phone number"
                                            className="rounded-l-none"
                                            required
                                        />
                                    </div>
                                    <InputError message={errors.whatsapp_number} className="mt-2" />
                                </div>
                            </div>

                            <div>
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Create a password"
                                    required
                                />
                                <InputError message={errors.password} className="mt-2" />
                            </div>
                            <div>
                                <Label htmlFor="password_confirmation">Confirm Password</Label>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    value={data.password_confirmation}
                                    onChange={(e) => setData('password_confirmation', e.target.value)}
                                    placeholder="Confirm password"
                                    required
                                />
                                <InputError message={errors.password_confirmation} />
                            </div>

                            <Button type="submit" className="mt-2 w-full" tabIndex={5} disabled={processing}>
                                {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                Create account
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-sm text-muted-foreground">
                                Already have an account?{' '}
                                <Link href={route('login')} className="text-warm-brown cursor-pointer hover:underline">
                                    Sign in here
                                </Link>
                            </p>
                            <p className="mt-2 text-xs text-muted-foreground">🔒 Secure & encrypted</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Register;
