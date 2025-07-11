<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // Skip redirection for logout route and other auth routes
        if ($request->routeIs('logout') || $request->routeIs('login') || $request->routeIs('register')) {
            return $next($request);
        }

        if ($request->user() && $request->user()->is_active) {
            $role = $request->user()->role;

            // If user is already on the correct dashboard, don't redirect
            $currentPath = $request->path();

            if ($role === 'admin' && !str_starts_with($currentPath, 'admin')) {
                return redirect()->route('admin.dashboard');
            } elseif ($role === 'instructor' && !str_starts_with($currentPath, 'instructor')) {
                return redirect()->route('instructor.dashboard');
            } elseif ($role === 'parent' && !str_starts_with($currentPath, 'parent') && !str_starts_with($currentPath, 'student')) {
                return redirect()->route('parent.dashboard');
            }
        }

        return $next($request);
    }
}
