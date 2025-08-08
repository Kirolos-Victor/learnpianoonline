<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class ContactController extends Controller
{
    public function index(): \Inertia\Response
    {
        return Inertia::render('Contact');
    }
}
