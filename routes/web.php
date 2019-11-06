<?php

use Illuminate\Http\Request;
use App\Vehicle;

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

Route::get('/map', 'HomeController@index')->name('home');

Route::middleware('auth:web')->get('/vehicles', function(Request $request) {
    return Vehicle::all();
});

Route::middleware('auth:web')->get('/vehicle/{vehicle}', function(Vehicle $Vehicle) {
    return $Vehicle;
});