<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Student;
use App\Services\LocationService;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register', [
            'countries' => LocationService::getCountries(),
            'countriesRequiringState' => LocationService::getCountriesRequiringStateSelection(),
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Determine if state/province is required based on country
        $stateRequired = $request->country ? LocationService::countryRequiresStateSelection($request->country) : false;

        $request->validate([
            'name' => 'required|string|min:2|max:255|regex:/^[a-zA-Z\s\-\'\.]+$/',
            'email' => 'required|string|lowercase|email|max:255|unique:' . User::class,
            'password' => [
                'required',
                'confirmed',
                'min:8',
                'max:128',
            ],
            'whatsapp_number' => 'nullable|string|min:10|max:20|regex:/^[\+]?[1-9][\d]{0,15}$/',
            'city' => 'nullable|string|min:2|max:255|regex:/^[a-zA-Z\s\-\'\.]+$/',
            'state_province' => $stateRequired ? 'required|string|min:2|max:255' : 'nullable|string|min:2|max:255',
            'country' => 'required|string|size:2',
        ], [
            'name.required' => 'Full name is required.',
            'name.min' => 'Name must be at least 2 characters long.',
            'name.regex' => 'Name can only contain letters, spaces, hyphens, apostrophes, and periods.',
            'email.required' => 'Email address is required.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email address is already registered. Please use a different email or try logging in.',
            'password.required' => 'Password is required.',
            'password.min' => 'Password must be at least 8 characters long.',
            'password.max' => 'Password cannot exceed 128 characters.',
            'password.confirmed' => 'Password confirmation does not match.',
            'password.regex' => 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.',
            'whatsapp_number.min' => 'Phone number must be at least 10 digits.',
            'whatsapp_number.max' => 'Phone number cannot exceed 20 digits.',
            'whatsapp_number.regex' => 'Please enter a valid phone number.',
            'city.min' => 'City name must be at least 2 characters long.',
            'city.regex' => 'City name can only contain letters, spaces, hyphens, apostrophes, and periods.',
            'state_province.required' => 'State/Province selection is required for your country to determine the correct timezone.',
            'state_province.min' => 'State/Province must be at least 2 characters long.',
            'country.required' => 'Please select your country.',
            'country.size' => 'Invalid country code.',
        ]);

        // Automatically determine timezone based on location
        $timezone = LocationService::getTimezoneByLocation(
            $request->country,
            $request->state_province,
            $request->city
        );

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'whatsapp_number' => $request->whatsapp_number,
            'role' => 'parent',
            'city' => $request->city,
            'state_province' => $request->state_province,
            'country' => $request->country,
            'timezone' => $timezone,
        ]);

        event(new Registered($user));

        Auth::login($user);

        // Clear any intended URL from session to prevent conflicts
        session()->forget('url.intended');

        return redirect()->route('parent.dashboard');
    }

    /**
     * Get locations for a specific country (AJAX endpoint)
     */
    public function getLocations(Request $request)
    {
        $country = $request->get('country');

        if (!$country) {
            return response()->json(['error' => 'Country parameter is required'], 400);
        }

        $locations = LocationService::getLocationsByCountry($country);

        return response()->json([
            'locations' => $locations,
            'country' => $country
        ]);
    }

    /**
     * Get phone code for a specific country (AJAX endpoint)
     */
    public function getPhoneCode(Request $request)
    {
        $country = $request->get('country');

        if (!$country) {
            return response()->json(['error' => 'Country parameter is required'], 400);
        }

        $phoneCode = LocationService::getCountryPhoneCode($country);

        return response()->json([
            'phone_code' => $phoneCode,
            'country' => $country
        ]);
    }
}
