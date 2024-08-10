<?php

namespace App\Http\Controllers;
use JavaScript;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class FrontendController extends Controller
{

    private function setJSVariables($owner_id = null, $ticket_id = null)
    {
        $auth_data = [
            "language" => "en",
            'app_name' => config('app.name'),
            'app_url' => config('app.url'),
            'authenticated' => false,
        ];
        if (Auth::check()) {
            $user = Auth::user();
            $auth_data["user"] = [
                "name" => $user->name,
                "email" => $user->email,
                "uuid" => $user->uuid,
            ];
            $auth_data["authenticated"] = true;



            if (!Auth::user()->hasRole('principal')) {
                $parent_or_user_id = empty($user->parent_id) ? $user->id : $user->parent_id;
                $parent_user = User::find($parent_or_user_id);
            }
            // Get Role name of current user
            $auth_data["role_name"] = strtolower($user->role);

        } else {
            $auth_data["authenticated"] = false;
        }
        JavaScript::put($auth_data);
    }

    public function index()
    {
        $this->setJSVariables();
        return view('welcome')->with([
            "lang" => Auth::user() ? Auth::user()->language : 'en'
        ]);
    }
}
