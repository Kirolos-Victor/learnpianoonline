<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(): \Inertia\Response
    {
        $users = User::where('role', '=', 'user')->get(['id', 'name', 'email', 'is_active', 'created_at']);

        return Inertia::render('admin/Users', [
            'users' => $users,
        ]);
    }

    public function restrictAccess($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => false]);
        return redirect()->back()->with('success', 'User access restricted successfully.');
    }

    public function activateUser($id)
    {
        $user = User::findOrFail($id);
        $user->update(['is_active' => true]);
        return redirect()->back()->with('success', 'User activated successfully.');
    }
}
