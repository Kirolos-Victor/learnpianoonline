<?php

namespace App\Http\Controllers\Parent;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index()
    {
        return Inertia::render('parent/Contact');
    }
}
