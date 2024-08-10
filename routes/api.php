<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\DeviceController;
use App\Http\Controllers\SubDeviceController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\SceneController;
use App\Http\Controllers\GroupController;

Route::post('/login', [AuthController::class, 'customerLogin']);
Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);
Route::get('/logout', [AuthController::class, 'logout']);

// customer create
Route::post('/customer/create', [CustomerController::class, 'create']);

//test route for passport
Route::group(["middleware" => ["auth:passport"]], function () {

    Route::get('/test', function() { dd(Auth::user()); });

    // customer create api
    Route::group(["prefix" => "customer"], function () {
        Route::controller(CustomerController::class)->group(function () {
            Route::post('/{uuid}', 'update');
            Route::post('/change-password/{id}', 'passwordUpdate');
        });
    });
    
    // device api
    Route::group(["prefix" => "device"], function () {
        Route::controller(DeviceController::class)->group(function () {
            Route::get('/', 'index');
            Route::post('/create', 'create');
            Route::post('/update', 'update');            
            Route::post('/device-status', 'deviceStatus');            
            Route::delete('/', 'delete');
        });
    });

    //scene api
    Route::group(["prefix" => "scene"], function () {
        Route::controller(SceneController::class)->group(function () {
            // Route::get('/', 'index');
            Route::post('/', 'createAndUpdate');
        });
    });

    //group api
    Route::group(["prefix" => "group"], function () {
        Route::controller(GroupController::class)->group(function () {
            Route::get('/{id}', 'list');
            Route::post('/add', 'add');
            Route::post('/edit', 'edit');            
            Route::delete('/{id}', 'delete');
        });
    });

    //subdevice api
    Route::group(["prefix" => "subdevice"], function () {
        Route::controller(SubDeviceController::class)->group(function () {
            Route::get('/{id}', 'list');
            Route::post('/', 'setTempUnit');
            Route::post('/update/{id}', 'update');            
            Route::delete('/{id}', 'delete');
        });
    });

    //alexa api
    Route::group(["prefix" => "alexa"], function () {
        Route::controller(SubDeviceController::class)->group(function () {
            Route::get('/devices', 'alexaDeviceList');
            Route::post('/device/control', 'deviceStatusUpdate');
            Route::get('/device/state', 'deviceState');     
        });
    });
});
