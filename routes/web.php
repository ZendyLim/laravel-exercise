<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\ClientController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/


Route::prefix('/api')->group(function () {
    
    Route::controller(AdminController::class)->group(function () {
        Route::post('/signup', 'create');
        Route::post('/signin', 'login');
    });

    Route::middleware('auth')->group(function () {

        Route::controller(AdminController::class)->group(function () {
            Route::get('/me', 'me');
            Route::get('/signout', 'logout');
        });
    
        Route::controller(ClientController::class)->prefix('/clients')->group(function () {
            Route::post('/', 'create');
            Route::get('/', 'list');
            Route::get('/{id}', 'get');
            Route::put('/{id}', 'edit');
            Route::delete('/{id}', 'delete');
        });
    });
});

Route::get('/auth', function () {
    return view('index');
})->name('login');

Route::get('{path}', function () {
    return view('index');
})->where('path', '^(.+)?$');
