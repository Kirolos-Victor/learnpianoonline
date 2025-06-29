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
        ]);
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'whatsapp_number' => 'required|string|max:20',
            'city' => 'nullable|string|max:255',
            'state_province' => 'nullable|string|max:255',
            'country' => 'required|string|max:2',
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
            'role' => 'user',
            'city' => $request->city,
            'state_province' => $request->state_province,
            'country' => $request->country,
            'timezone' => $timezone,
        ]);

        event(new Registered($user));

        Auth::login($user);

        return redirect()->intended(route('student.index', absolute: false));
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
