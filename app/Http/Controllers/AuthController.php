<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

class AuthController extends Controller
{
    // Loin function for web and OAuth 2.0 
    public function login(Request $request)
    {
        $credentials = request(['email', 'password']);
        $validation = Validator::make($credentials, [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
        ]);

        if ($validation->fails()) {
            return response()->json($validation->errors()->toArray(), 422);
        } else {
            if (!Auth::attempt($credentials)) {
                return response()->json(['error' => 'Credentials mismatch!'], 401);
            }
            $user = Auth::user();
            return response()->json([
                "authenticated" => true,
                "user" => $user,
                "ref" => $request->session()->get('redirect_uri', '/')
            ]);
        }
    }

    // Loin function for android (Customer Login) (token login)
    function customerLogin(Request $request)
    {
        extract($request->all());
        $credentials = request(['email', 'password', 'device_name']);
        $validation = Validator::make($credentials, [
            'email' => ['required', 'string', 'email', 'max:255'],
            'password' => ['required', 'string'],
            'device_name' => ['required'],
        ]);

        if ($validation->fails()) {
            return response()->json($validation->errors()->toArray(), 422);
        } else {
            $credentials = $request->only('email', 'password');
       
            if (Auth::attempt($credentials)) {
                $user = Auth::user();
                $token = $user->createToken($device_name)->accessToken;

                return response()->json([
                    'status' => 'success',
                    'token' => $token,
                ]);
            };

            return response()->json(['error' => 'Unauthorized'], 401);
        }
    }

    // Admin, Stafff, Customer Logout 
    public function logout()
    {
        Auth::logout();
        return redirect()->to('/');
    }

    // Send reset password email 
    public function sendResetLinkEmail(Request $request)
    {
        $data = $request->all();
        $validation = Validator::make($data, [
            'email' => ['required', 'string', 'email', 'exists:users']
        ]);
        if ($validation->fails()) {
            return response()->json($validation->errors()->toArray(), 422);
        }

        // We will send the password reset link to this user. Once we have attempted
        // to send the link, we will examine the response then see the message we
        // need to show to the user. Finally, we'll send out a proper response.
        $response = Password::broker()->sendResetLink(
            $request->only('email')
        );
        return $response == Password::RESET_LINK_SENT
                ? response()->json(["success" => true])
                : response()->json(["email" => "Email not registred!"], 422);
    }

    // Password rest by validating data and token
    public function resetPassword(Request $request) 
    {
        $credentials = $request->only(
            'email',
            'password',
            'password_confirmation',
            'token'
        );
        $validation = Validator::make($credentials, [
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'token' => ['required', 'string'],
            'email' => ['required', 'email', 'string']
        ]);
        
        // Data Validation Error
        if($validation->fails()) {
            return response()->json($validation->errors()->toArray(), 422);
        }

        $response = Password::reset($credentials, function ($user, $password) {
            $user->password = Hash::make($password);
            $user->save();
        });

        // Token validation error
        if ($response == Password::INVALID_TOKEN) {
            return response()->json(["token" => ["Invalid Token"]], 422);
        }

        return response()->json(["Password Updated Successfully" => true]);
    }
}