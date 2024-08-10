<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class LocationController extends Controller
{
     /**
     * @param request
     * @return Object
     */
    public function create(Request $request)
    {
        $data = $request->all();
        $validation = Validator::make($data, [
            'name' => ['required', 'string']
        ]);

        if ($validation->fails()) {
            return response()->json($validation->errors()->toArray(), 422);
        }

        $user = Auth::user();

        $location = Location::create([
            'name' => $data['name'],
            'uuid' => random_strings('Location', 7)
        ]);

        $user->default_location_id = $location->id;
        $user->save();

        return response()->json($location);
    }
}
