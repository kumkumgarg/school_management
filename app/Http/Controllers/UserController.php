<?php

namespace App\Http\Controllers;

use App\Models\StaffMeta;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\File;

class UserController extends Controller
{
    // fetch user's details
    public function index()
    {
        $logged_in_user = Auth::user();
        $logged_in_user->with('location');

        $user_meta = StaffMeta::where("user_id", $logged_in_user->id)->first();
        $user_meta["default_location_id"] = $logged_in_user->default_location_id;
        $user_meta["locations"] = $logged_in_user->location;
        $user_meta["email"] = $logged_in_user->email;
        $user_meta["phone"] = $logged_in_user->phone;

        try{
            return response()->json($user_meta, 200);
        } catch (\Throwable $th) {
            return response()->json(["error" => $th->getMessage()], 422);
        }
    }

    //All User setting update code
    public function update(Request $request)
    {
        $user = $request->has('id') ? User::find($request->id) : Auth::user();
        $user_meta = StaffMeta::where("user_id", $user->id)->first();

        if ($request->hasFile('profile_pic')) {
            if (!empty($user_meta->profile_pic)) {
                Storage::disk('public')->delete("$user->id/profile-pic/" . $user_meta->profile_pic);
            }
            $file_name = Str::uuid()->toString() . "." . $request->file('profile_pic')->extension();
            $path = $request->file('profile_pic')->storeAs("$user->id/profile-pic", $file_name, "public");
            $user_meta->profile_pic = $file_name;
        }

        if ($request->has('delete_pic') && $request['delete_pic'] == true) {
            if (!empty($user_meta->profile_pic)) {
                Storage::disk('public')->delete("$user->id/profile-pic/" . $user_meta->profile_pic);
            }
            $user_meta->profile_pic = null;
        }

        $user_meta->fill($request->only(['first_name', 'last_name', 'dob']));

        $user->fill($request->only(['phone', 'email']));

        if ($request->has('password')) {
            if (Hash::check($request->get('old_password'), $user->password)) {
                $user->password = Hash::make($request->get('password'));
            } else {
                return response()->json(['error' => 'unauthorized or Password Mismatched'], 401);
            }
        }
        $user->save();
        $user_meta->save();

        return response()->json(["user"=> $user, 'user_meta'=> $user_meta]);
    }


    public function getProfilePicture($file_name)
    {
        $user_meta = StaffMeta::where('profile_pic', $file_name)->firstOrFail();

        if ($user_meta) {
            try {
                $file_name = "$user_meta->user_id/profile-pic/" . $file_name;
                $path = Storage::disk('public')->path($file_name);
                $file = File::get($path);
                $type = File::mimeType($path);

                $response = Response::make($file, 200);
                $response->header("Content-Type", $type);

                return $response;
            } catch (\Throwable $th) {
                $user_meta->profile_pic = null;
                $user_meta->save();
            }
        }
        return response()->json(["error" => false], 404);
    }
}
