<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\StaffMeta;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use App\Notifications\InvitationNotification;
use App\Events\StaffEvent;

class StaffController extends Controller
{
    public function index(Request $request, $id = null)
    {
        $target = $request->search;
        $staff = null;
        if ($id == null) {
            $staff = User::withTrashed()
                // ->whereHas('roles', function ($query) {
                //     $query->whereNotIn('name', ['admin', 'customer']);
                // })
                ->with('staff_meta')
                ->where(function ($q) use ($target) {
                    $q->where('users.email', 'LIKE', "%{$target}%")
                        ->orWhere('users.phone', 'LIKE', "%{$target}%")
                        ->orWhereHas('roles', function ($query) use ($target) {
                            $query->where('name', 'LIKE', "%{$target}%");
                        })
                        ->orWhereHas('staff_meta', function ($query) use ($target) {
                            $query->where('first_name', 'LIKE', "%{$target}%")
                                ->orWhere('last_name', 'LIKE', "%{$target}%");
                        });
                });
            $staff = $staff->paginate(10);
        }else{
            $staff = User::where('id', $id)->with('staff_meta')->first();
        }
       return response()->json($staff, 200);
    }

    // staff creating
    public function create(Request $request)
    {
        $data = $request->all();
        $user = Auth::user();
        $staff_exists = User::where("email", $data['email'])->withTrashed()->exists();
        if($staff_exists){
            return response()->json(['message' => 'email already associated with another account!'], 403);
        }
        try{
            // this will generate a random password
            $temp_pass = temp_pass(20);
            $role_name = $data['role'];

            // uuid will automatically created. Visit user model.
            $create_user = [
                'email'       => $data['email'],
                'phone'       => $data['phone'] ? $data['phone'] : null,
                'password'    => Hash::make($temp_pass),
                'role'        => $role_name,
            ];

            $staff = User::create($create_user);

            $create_user_meta = [
                'user_id'       => $staff->id,
                'first_name'    => $data['first_name'],
                'last_name'     => $data['last_name'],
                'dob'           => $data['dob'],
            ];
            $user_meta = StaffMeta::create($create_user_meta);

            $staff->assignRole(Role::where("name", $role_name)->first());

            //send email to the user created with temp pass.
            $token = Password::broker()->createToken($staff);
            $staff->first_name = $data['first_name'];

            try {
                $staff->notify(new InvitationNotification($token));
            } catch (\Throwable $th) {
                return response()->json(["send_mail" => "sparkpost limit exceed"], 500);
            }

            // dispatch event
            StaffEvent::dispatch();

            return response()->json(["staff_user" => $staff, "staff_user_meta" => $user_meta], 200);
        }catch (\Throwable $th) {
            return response()->json(["error" => $th->getMessage()], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $data = $request->all();
        $user = Auth::user();
        $staff_user = User::where("uuid", $id)->first();
        $staff_user_meta = StaffMeta::where("user_id", $staff_user->id)->first();

        $role_name = $data['role'];

        if(!$staff_user){
            return response()->json(['message' => 'staff not found!'], 404);
        }

        $staff_user_meta->first_name  = $data['first_name'];
        $staff_user_meta->last_name   = $data['last_name'];
        $staff_user_meta->dob         = $data['dob'];

        $staff_user->email       = $data['email'];
        $staff_user->phone       = $data['phone'];
        $staff_user->role        = $role_name;

        $role = Role::where("name", $role_name)->first();
        $staff_user->roles()->detach();
        $staff_user->assignRole(Role::where("name", $role_name)->first());

        $staff_user_meta->save();
        $staff_user->save();

        // dispatch event
        StaffEvent::dispatch();

        return response()->json(["staff_user" => $staff_user, "staff_user_meta" => $staff_user_meta], 200);
    }

    public function delete(Request $request, $id) {
        $staff = User::where("uuid", $id)->first();
        if(!$staff){
            return response()->json(['message' => 'staff not found!'], 404);
        }
        //soft delete staff
        $staff->delete();
        return response()->json(['message'=>'staff deleted'], 200);
    }

    public function handleDisable($id)
    {
        $staff = User::withTrashed()->where('uuid', $id)->with('staff_meta')->first();
        // When disable already
        if (!empty($staff->deleted_at)) {
            $staff->restore();
        } else { //when enable already and then disable it
            $staff->delete();
        }
        return response()->json(["name" => $staff->staff_meta->full_name, "deleted_at" => $staff->deleted_at]);
    }
}
