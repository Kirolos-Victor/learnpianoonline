<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index(): \Illuminate\Http\RedirectResponse|\Inertia\Response
    {
        if (Auth()->check()) {
            return redirect()->route('dashboard.index');
        }

        return Inertia::render('Home');
    }
}
