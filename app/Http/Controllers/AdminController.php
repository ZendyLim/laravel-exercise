<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use App\Http\Resources\AdminResource;
use App\Models\Admin;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AdminController extends Controller {
  public function create(SignUpRequest $request) {
    $validated = $request->validated();

    $user = Admin::create([
      'first_name' => $validated['firstName'],
      'last_name' => $validated['lastName'],
      'email' => $validated['email'],
      'password' => Hash::make($validated['password']),
    ]);

    Auth::login($user);

    return new AdminResource($user);
  }

  public function login(SignInRequest $request) {
    $credentials = $request->only('email', 'password');

    if (Auth::attempt($credentials)) {
      return new AdminResource(Auth::user());
    }

    return response(null, 401);
  }

  public function me() {
    return new AdminResource(Auth::user());
  }

  public function logout() {
    return Auth::logout();
  }
}
