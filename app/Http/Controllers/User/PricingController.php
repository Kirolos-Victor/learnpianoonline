<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PricingController extends Controller
{
    public function index(): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        if (Auth::check()) {
            return redirect()->route('parent.subscription');
        }
        return Inertia::render('Pricing');
    }
}
