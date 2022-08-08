<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Http\Requests\CreateClientRequest;
use App\Http\Requests\UpdateClientRequest;
use App\Http\Resources\ClientResource;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class ClientController extends Controller {
  public function create(CreateClientRequest $request) {
    $file = $request->file('profilePicture');

    $hash = sha1(Carbon::now()->toDateTimeString().$file->getClientOriginalName());

    $asset = $file->store($hash, ['disk' => 'public']);

    $client = Auth::user()->clients()->create([
      'name' => $request->name,
      'email' => $request->email,
      'profile_picture' => Storage::url($asset)
    ]);

    return new ClientResource($client);
  }

  public function edit(UpdateClientRequest $request, $id) {
    $client = Auth::user()->clients()->findOrFail($id);

    $file = $request->file('profilePicture');

    if (!empty($file)) {
      $hash = sha1(Carbon::now()->toDateTimeString().$file->getClientOriginalName());

      $asset = $file->store($hash, ['disk' => 'public']);

      $client->profile_picture = Storage::url($asset);
    }

    $client->name = $request->name;
    $client->email = $request->email;

    $client->save();

    return new ClientResource($client);
  }

  public function get($id) {
    $client = Auth::user()->clients()->findOrFail($id);
    
    return new ClientResource($client);
  }

  public function delete($id) {
    $client = Auth::user()->clients()->findOrFail($id);

    $client->delete();
    
    return new ClientResource($client);
  }

  public function list(Request $request) {
    $keyword = $request->search;

    $clientsQuery = Auth::user()->clients();

    if (!empty($keyword)) {
      $clientsQuery->where('name', 'LIKE', '%'.$keyword.'%')->orWhere('email', 'LIKE', '%'.$keyword.'%');
    }

    $clientsQuery->orderBy('id', 'ASC');

    $clients = $clientsQuery->paginate(15);
    
    return [
      'total' => $clients->total(),
      'totalPage' => $clients->lastPage(),
      'perPage' => $clients->perPage(),
      'currentPage' => $clients->currentPage(),
      'items' => $clients->items()
    ];
  }
}
