<?php

namespace App\Http\Controllers;

use App\Models\Location;
use App\Models\Setting;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function index(Request $request)
    {
        $data = $request->all();
        $user = Auth::user();
        $parent_or_user_id = empty($user->parent_id) ? $user->id : $user->parent_id;
        if ($data['display_name'] == 'business_schedule' || $data['display_name'] == 'pre_saved_messages') {
            $settings = Setting::where([
                'user_id' => $parent_or_user_id,
                'display_name' => $data['display_name']
            ])->first();
        } else {
            $settings = Setting::where([
                'user_id' => $parent_or_user_id,
                'location_id' => $user->default_location_id,
                'display_name' => $data['display_name']
            ])->first();
        }

        if (!$settings) {
            // Return empty response
            return response()->json([]);
        }

        return response()->json($settings);
    }

    public function update(Request $request)
    {
        $data = $request->all();
        $user = Auth::user();
        if ($data['type'] == 'universal_settings') {
            $settings = Setting::firstOrCreate([
                'user_id' => $user->id,
                'display_name' => $data['display_name'],
            ]);
        } else {
            $settings = Setting::firstOrCreate([
                'user_id' => $user->id,
                'location_id' => $user->default_location_id,
                'display_name' => $data['display_name'],
            ]);
        }
        $settings->fill($data);

        $settings->save();
        return response()->json($settings);
    }

    //get particular setting
    public function getSettings(Request $request)
    {
        $type = $request->input('type');
        if($type == null){
            $type = 'location';
        }
        $user = Auth::user();

        $settings = Setting::where('type', $type)
            ->where('location_id', $user->default_location_id)
            ->pluck('value', 'key')
            ->toArray();

        $location_name = Location::where('id', $user->default_location_id)->pluck('name')->first();

        $settings['location'] = $location_name;

        return response()->json($settings);
    }

    //get config settings list
    public function configSettingList(Request $request)
    {
        $result = "settings." . $request->type;
        //get config file data
        $configData = config($result);
        $this->_addKeyForDisplayName($configData, $request->type);

        return response()->json($configData);
    }

    public function _addKeyForDisplayName(&$array, $parentKey)
    {
        foreach ($array as $key => &$value) {
            if (is_array($value)) {
                if($key == "options"){
                    return;
                }
                $currentKey = $parentKey ? "$parentKey.$key" : $key;

                $value['key'] = $currentKey;
                $this->_addKeyForDisplayName($value, $currentKey);
            }
        }
    }

    //save new format setting
    public function saveSetting(Request $request)
    {
        // Extract the request data
        $data = $request->all();

        $location_data = Location::where('name', $data['location'])->first();

        // Create a new location entry
        if (!$location_data) {
            $location_data = Location::create([
                'name' => $data['location'],
                'uuid' => random_strings('Location', 7)
            ]);
            Auth::user()->update(['default_location_id' => $location_data->id]);
        }

        // Remove the location key from the data array
        unset($data['location']);

        foreach ($data as $key => $value) {
            // Handle the logo separately
            if ($key === "school_logo" && $request->hasFile('school_logo')) {

                $value = $this->_handleLogo($data['school_logo'], null);
            }

            // Check if a setting already exists
            $setting = Setting::where('key', $key)->where('location_id', $location_data->id)->first();

            if (!$setting) {
                // Create a new setting entry
                $setting = Setting::create([
                    "location_id"  => $location_data->id,
                    "type"         => 'location',
                    "key"          => $key,
                    "value"        => $value,
                ]);
            } else {
                // Update the existing setting entry
                $setting->value = $value;
                $setting->save();
            }
        }

        return response()->json(['message' => 'Settings saved successfully'], 200);
    }


    public function _handleLogo($school_logo, $oldSettingData)
    {
        $user_id = Auth::user()->pluck('id')->first();

        // Delete old avatar file
        if ($oldSettingData && property_exists( $oldSettingData->value, 'image') && $oldSettingData->value != null) {
            $file_name = "$user_id/business_logos/" . $oldSettingData->value;
            $path = Storage::disk('public')->path($file_name);
            File::delete($path);
        }
        $file_name = Str::uuid()->toString() . "." . $school_logo->extension();

        $path = $school_logo->storeAs(
            "$user_id/business_logos",
            $file_name,
            "public"
        );

        return $school_logo ? $file_name : null;
    }

    public function getBusinessLogo($file_name)
    {
        $user_id = Auth::user()->pluck("id")->first();
        try {
            $file_name = "$user_id/business_logos/" . $file_name;
            $path = Storage::disk('public')->path($file_name);
            $file = File::get($path);
            $type = File::mimeType($path);

            $response = Response::make($file, 200);
            $response->header("Content-Type", $type);

            return $response;
        } catch (\Throwable $th) {
            return response()->json(["error" => false], 404);
        }
    }
}
