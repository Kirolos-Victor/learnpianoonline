<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(Request $request): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        $user = $request->user();
        if ($user) {
            return redirect()->route('parent.dashboard');
        }

        return Inertia::render('Home');
    }
}
