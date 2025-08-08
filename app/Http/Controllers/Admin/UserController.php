<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index(Request $request): \Inertia\Response
    {
        $perPage = $request->get('per_page', 25);
        $search = $request->get('search', '');
        $status = $request->get('status', 'all'); // all, active, inactive

        $query = User::where('role', '=', 'parent');

        // Apply search filter
        if ($search) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($status === 'active') {
            $query->where('is_active', true);
        } elseif ($status === 'inactive') {
            $query->where('is_active', false);
        }

        // Get paginated results
        $users = $query->select(['id', 'name', 'email', 'is_active', 'created_at'])
            ->orderBy('created_at', 'desc')
            ->paginate($perPage)
            ->withQueryString(); // Preserve query parameters in pagination links

        // Get summary statistics
        $stats = [
            'total' => User::where('role', 'parent')->count(),
            'active' => User::where('role', 'parent')->where('is_active', true)->count(),
            'inactive' => User::where('role', 'parent')->where('is_active', false)->count(),
        ];

        return Inertia::render('admin/Parents', [
            'users' => $users,
            'stats' => $stats,
            'filters' => [
                'search' => $search,
                'status' => $status,
                'per_page' => $perPage,
            ],
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
