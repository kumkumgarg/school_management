<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class CheckPermission
{
    /**
     * Handle an incoming request.
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next, $permission): Response
    {

        $user = Auth::user();
        // dd($permission, $user && ($user->roles[0]->name == "super_admin" || $user->roles[0]->name == "admin" || $user->roles[0]->hasPermissionTo($permission)));
        if ($user && ($user->roles[0]->name == "super_admin" || $user->roles[0]->name == "admin" || $user->roles[0]->hasPermissionTo($permission))) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized'], 403);
    }
}
