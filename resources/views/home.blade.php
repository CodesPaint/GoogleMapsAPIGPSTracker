@extends('layouts.app')

@section('content')
<div class="wrapper"> 
    @auth
    <!-- Map -->
    <div class="map" id="map"></div>

    <!-- Vehicle Controls -->
    <div class="col-md-2 controlsContainer">
        <div class="main-card mb-3 card monitorOptions">
            <div class="card-body">
                <h5 class="card-title font-weight-bold text-center">Monitoring Options</h5>
                <form class="" autocomplete="off">
                    <div class="position-relative form-group">
                        <div id="refreshIntervalLabel">Update Interval: <span id="monitorRefreshInterval">5s</span></div>
                        <div><input type="range" min="5" max="60" value="5" class="refreshIntervalSlider" oninput="UpdateSlider(this.value);"></div>
                    </div>
                    <span class="monitorControls text-center">
                        <button id="alertVehicle" type="button" class="mt-1 btn btn-primary btn-sm" title="">Alert</button>
                        <button id="disableVehicle" type="button" class="mt-1 btn btn-danger btn-sm" title="">Disable</button>
                    </span>
                </form>
            </div>
        </div>
        <div class="main-card mb-3 card">
            <div class="card-body">
                <h5 class="card-title font-weight-bold text-center">Vehicle Information</h5>
                <form class="" autocomplete="off">
                    <div class="position-relative form-group">
                        <div><b>Type:</b> <span class="vehicleType"></span></div>
                        <div><b>Vehicle:</b> <span class="vehicleMakeModel"></span></div>
                        <div><b>Colour:</b> <span class="vehicleColour"></span></div>
                        <div><b>Registration:</b> <span class="vehicleRegistration"></span></div>
                        <div><b>Position:</b> <span class="vehiclePosition"></span></div>
                        <div><b>Speed:</b> <span class="vehicleSpeed"></span></div>
                        <div><b>Stolen:</b> <span class="vehicleStolen"></span></div>
                    </div>
                    <button id="monitorVehicle" type="button" class="mt-1 btn btn-primary btn-sm" title="Monitor the selected vehicle">Monitor</button>
                    <button id="zoomToVehicle" type="button" class="mt-1 btn btn-primary btn-sm" title="Zoom to the selected vehicle">Zoom</button>
                    <button id="resetView" type="button" class="mt-1 btn btn-success btn-sm" title="Reset View">Reset View</button>
                </form>
            </div>
        </div>
    </div>

    <!-- Settings Modal -->
    <div class="modal fade" id="Settings" tabindex="-1" role="dialog" aria-labelledby="settingsModal" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title" id="myModalLabel">Settings</h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                </div>
                <div class="modal-body">
                    <table width="100%">
                        <tr>
                            <td class="h6">Dark Mode</td>
                            <td class="float-right">
                                <label class="switch">
                                    @if(Auth::user()->theme === 0) 
                                    <input id="darkModeToggle" type="checkbox">
                                    @else 
                                    <input id="darkModeToggle" type="checkbox" checked>
                                    @endif
                                    <span class="slider round"></span>
                                </label>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                &nbsp;
                            </td>
                        </tr>
                        <tr>
                            <td class="h6">Update Interval <span id="updateTime">({{ Auth::user()->refreshtime }}s)</span></td>
                            <td class="float-right">
                                <input type="range" min="5" max="60" value="{{ Auth::user()->refreshtime }}" class="refreshIntervalSlider" oninput="UpdateRefresh(this.value);">
                            </td>
                        </tr>
                        
                    </table>
                </div>
            </div>
        </div>
    </div>
    @endauth
</div>   
@endsection
