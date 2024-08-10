<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ClassCategoryController;
use App\Http\Controllers\ClassesController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\FrontendController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CustomRoleController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\PermissionsController;
use App\Http\Controllers\SettingController;
use App\Http\Controllers\SubjectController;
use App\Http\Controllers\SyllabusController;

// Route::get('/', function () {
//     return view('welcome');
// });
Route::post("/login", [AuthController::class, 'login']);
Route::get("/login", [FrontendController::class, 'index'])->name("login");
Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword'])->name('password.reset');
Route::get('/profile-pic/{file_name}', [UserController::class, 'getProfilePicture']);  // to display user image

Route::group(["middleware"=>["auth:web"]], function () {

    Route::get('logs', [\Rap2hpoutre\LaravelLogViewer\LogViewerController::class, 'index']);

    Route::prefix('user-settings')->group(function ($route) {
        $route->get('/', [UserController::class, 'index']);
        $route->post('/', [UserController::class, 'update']);
    });

    Route::group(["prefix" => "role"], function () {
        Route::controller(CustomRoleController::class)->group(function () {
            Route::get('/{id?}', 'index');
            Route::post('/', 'create');
            Route::put('/{id}', 'update');
        });
        Route::delete('/{id}', [CustomRoleController::class, 'roleDelete']);
    });

    Route::group(["prefix" => "class_category"], function () {
        Route::controller(ClassCategoryController::class)->group(function () {
            Route::get('/', 'index');
        });
    });

    Route::group(["prefix" => "subject"], function () {
        Route::controller(SubjectController::class)->group(function () {
            Route::get('/', 'index');
        });
    });

    Route::group(["prefix" => "syllabus"], function () {
        Route::controller(SyllabusController::class)->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
        });
    });

    Route::group(["prefix" => "class"], function () {
        Route::controller(ClassesController::class)->group(function () {
            Route::get('/{id?}', 'index');
            Route::post('/', 'create');
            Route::put('/{id}', 'update');
            Route::delete('/{id}', 'categoryDelete');
        });
    });

    Route::group(["prefix" => "permission"], function ($router) {
        Route::get('/permission-list', [PermissionsController::class, 'getPermissionList']);
    });

    Route::get('logout', [AuthController::class, 'logout']);

    Route::prefix('staff-data')->group(function ($route) {
        $route->get('/{id?}', [StaffController::class, 'index']);
        $route->post('/', [StaffController::class, 'create']);
        $route->put('/{id}', [StaffController::class, 'update']);
        $route->delete('/{id}', [StaffController::class, 'delete']);
        $route->patch('/{id}', [StaffController::class, 'handleDisable']);
    });

    Route::group(["prefix" => "location"], function ($router) {
        Route::get('/{id?}', [LocationController::class, 'index']);
        Route::post('/', [LocationController::class, 'create']);
        Route::patch('/{id}', [LocationController::class, 'handleDisable']);
        Route::put('/{id}', [LocationController::class, 'update']);
        Route::delete('/{id}', [LocationController::class, 'delete']);
    });

    Route::group(["prefix" => "settings"], function ($router) {
        Route::get('/', [SettingController::class, 'index']);
        Route::post('/', [SettingController::class, 'update']);
        Route::get('/setting-list', [SettingController::class, 'configSettingList']);
        Route::get('/get_settings', [SettingController::class, 'getSettings']);
        Route::post('/save_setting', [SettingController::class, 'saveSetting']);
    });

    Route::get('/business_logos/{file_name}', [SettingController::class, 'getBusinessLogo']);

});

// first this route will hit which redirect to login
Route::any('{all}', [FrontendController::class, 'index'])->where(['all' => '^((?!api).)*$']);

// to check permission add in "web_api"
Route::get('/check-permission', [CustomRoleController::class, 'isPermissionAllowed']);
