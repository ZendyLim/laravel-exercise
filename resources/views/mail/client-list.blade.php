<h1>Your Client List</h1>

<ul>
@foreach ($clients as $client)
    <li>{{$client->name}} ({{$client->email}})</li>
@endforeach
<ul>