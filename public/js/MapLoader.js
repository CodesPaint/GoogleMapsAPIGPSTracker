// Adam Eastwood 2019

$(document).ready(function() {
    $('#alertVehicle').click(function() {
        AlertVehicle();
    });
    $('#darkModeToggle').click(function() {
        ChangeTheme();
    });
    $('#disableVehicle').click(function() {
        DisableVehicle();
    });
    $('#monitorVehicle').click(function() {
        MonitorVehicle();
    });
    $('#resetView').click(function() {
        ResetView();
    });
    $('#vehicleSearch').click(function() {
        Search();
    });
    $('#zoomToVehicle').click(function() {
        ZoomToVehicle();
    });
});

const IcoURI = "https://tracker.adameastwood.com/imgs/ico"
var monitorDelay = 5; //Default monitor delay time

var activeMonitor,
    activeVehicle,
    defaultPosition = {
        lat: 54.242118, 
        lng: -4.512708
    },
    defaultZoom = 6,
    map,
    monitorState = 0,
    timer,
    timeValue,
    vehicleMarker,
    vehicleMarkers = [],
    vehicleToMonitor;

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: defaultPosition.lat,
            lng: defaultPosition.lng
        },
        disableDefaultUI: false,
        streetViewControl: false,
        fullscreenControl: false,
        zoom: defaultZoom,
        styles: GetTheme()
    });

    map.addListener('center_changed', function() {
        $('#resetView').show();
    });

    map.addListener('zoom_changed', function() {
        if (map.getZoom() !== 6) {
            $('#resetView').show();
        } else {
            $('#resetView').hide();
        }
    });

    ResizeMap();

    $(window).resize(function() {
        ResizeMap();
    });

    GetVehicles();
}

//Function: Alert the vehicle
function AlertVehicle() {
    alert(JSON.stringify(activeVehicle));
}

//Function: Change Theme
function ChangeTheme() {
    let theme;

    if (!document.getElementById('darkModeToggle').checked) {
        userStyle = 0;
    } else {
        userStyle = 1;
    }

    UserUpdateTheme();
    theme = { styles: GetTheme() };

    map.setOptions(theme);
}

//Function: Returns "Unspecified" if input is empty
function CheckNull(input) {
    if (!input) {
        return "Unspecified";
    } else {
        const upper = input.replace(/^\w/, function(chr) {
            return chr.toUpperCase();
        });
        return upper;
    }
}

//Function: Clear Vehicle Markers
function ClearVehicleMarkers() {
    for (var i = 0; i < vehicleMarkers.length; i++) {
        vehicleMarkers[i].setMap(null);
    }

    vehicleMarkers = [];
    GetVehicles();
};

//Function: Stops Ignition from activating
function DisableVehicle() {
    if (activeVehicle.disabled === 0) {
        swal("Deactivated", `${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.registration}) has been deactivated`, "success");
    } else {
        swal("Reactivated", `${activeVehicle.make} ${activeVehicle.model} (${activeVehicle.registration}) has been reactivated`, "success");
    }
}

//Function: Load Vehicles, Add Vehicle Markers
function GetVehicles() {
    var Vehicles = new XMLHttpRequest();

    Vehicles.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {

            try {
                Vehicles = JSON.parse(this.responseText);
            } catch (error) {
                swal("User Not Authenticated", "Reason: You are not permitted to reload vehicles at this time\nError: Invalid API Token", "info");
                return;
            }

            for (var i = 0; i < Vehicles.length; i++) {
                VehicleCount = Vehicles.length;
                var Vehicle = Vehicles[i];
                LoadVehicle(Vehicle);
            }

            if (vehicleToMonitor) {
                activeMonitor = true;
                for (var i = 0; i < vehicleMarkers.length; i++) {
                    if (vehicleMarkers[i]['content'].id === activeVehicle.id) {
                        activeVehicle = vehicleMarkers[i]['content'];
                        google.maps.event.trigger(activeVehicle, 'click');
                        return;
                    }
                }
            }
        }
    };

    Vehicles.open("GET", `https://tracker.adameastwood.com/vehicles`, true);
    Vehicles.send();
}

//Function: Get Theme
function GetTheme() {
    switch (userStyle) {
        case 0:
            return MapStyleLight();

        case 1:
            return MapStyleDark();
            

        default:
            return MapStyleLight();
    }
}

//Function: Load Individual Vehicle
function LoadVehicle(Vehicle) {
    vehicleMarker = new google.maps.Marker({
        position: new google.maps.LatLng(Vehicle.lat, Vehicle.lon),
        content: Vehicle,
        icon: `${IcoURI}/${Vehicle.type}.png`,
        map: map
    });

    google.maps.event.addDomListener(vehicleMarker, 'click', function() {
        activeVehicle = Vehicle;
        ToggleInformation();
        UpdateActivateState();
    });

    vehicleMarkers.push(vehicleMarker);
}

function MapStyleDark() {
    return [{
            "featureType": "all",
            "elementType": "labels.text.fill",
            "stylers": [{
                    "saturation": 36
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 40
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.text.stroke",
            "stylers": [{
                    "visibility": "on"
                },
                {
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "all",
            "elementType": "labels.icon",
            "stylers": [{
                "visibility": "off"
            }]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.fill",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "administrative",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 17
                },
                {
                    "weight": 1.2
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "geometry",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 20
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 21
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 29
                },
                {
                    "weight": 0.2
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 18
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 16
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 19
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [{
                    "color": "#000000"
                },
                {
                    "lightness": 17
                }
            ]
        }
    ];
}

function MapStyleLight() {

    return [
        {
            "featureType": "administrative",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#444444"
                }
            ]
        },
        {
            "featureType": "landscape",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#f2f2f2"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "labels.text",
            "stylers": [
                {
                    "color": "#000000"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#656565"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#c2ebaf"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text",
            "stylers": [
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "all",
            "stylers": [
                {
                    "saturation": -100
                },
                {
                    "lightness": 45
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e1e1e1"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e2e2e2"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#ffffff"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e1e1e1"
                }
            ]
        },
        {
            "featureType": "road.arterial",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                },
                {
                    "saturation": "0"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "color": "#e1e1e1"
                }
            ]
        },
        {
            "featureType": "road.local",
            "elementType": "labels.icon",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "all",
            "stylers": [
                {
                    "visibility": "off"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "all",
            "stylers": [
                {
                    "color": "#46bcec"
                },
                {
                    "visibility": "on"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "visibility": "on"
                },
                {
                    "saturation": "0"
                },
                {
                    "color": "#aadaff"
                }
            ]
        }
    ];    
}

//Function: Monitor
function Monitor() {
    if (monitorState === 0) {
        clearTimeout(timer);
    } else {
        ClearVehicleMarkers(map);
        map.setCenter(new google.maps.LatLng(activeVehicle.lat, activeVehicle.lon));
        timer = setTimeout(Monitor, monitorDelay * 1000);
    }
}

//Function: Monitor Vehicle
function MonitorVehicle() {
    vehicleToMonitor = activeVehicle.id;
    $('#monitorVehicle').toggleClass('btn-primary btn-danger');
    if(activeVehicle.disabled === 1){
        $('#disableVehicle').removeClass('btn-danger').addClass('btn-success').text('Activate');
    }
    UpdateState();
    Monitor();
    if(vehicleToMonitor){
        ZoomToVehicle();
    }
}

//Function: Reload All Vehicle Markers
function ReloadVehicles() {
    ClearVehicleMarkers();

}

//Function: Reset View
function ResetView() {
    map.setCenter(new google.maps.LatLng(defaultPosition.lat, defaultPosition.lng));
    map.setZoom(defaultZoom);
}

//Function: Resize Map
function ResizeMap() {
    var mapSize = $(window).height() - 55;
    $("#map").height(mapSize);
}

//Function: Search Vehicle
function Search() {
    var results = 0;
    var searchTerm = $('#VehicleSearch').val().toUpperCase();

    if (!searchTerm) {
        $('#VehicleSearch').focus();
        return;
    }

    for (var i = 0; i < vehicleMarkers.length; i++) {
        if (vehicleMarkers[i]['content'].registration === searchTerm) {
            $('#VehicleSearch').val("");
            activeVehicle = vehicleMarkers[i]['content'];
            google.maps.event.trigger(vehicleMarkers[i], 'click');
            ZoomToVehicle();
            results++;
            break;
        }
    }

    if (results === 0) {
        swal("Not Found", "Unable to Find Vehicle", "info");
    }
}

//Function: Show Settings
function Settings() {
    alert(1);
    map.setOptions = ({
        styles: MapStyleLight()
    });
}

//Function: Returns HTML if vehicle stolen or not
function Stolen(stolen) {
    if (stolen === 0) {
        return "<font style='color: green;'>No</font>"
    } else {
        return "<font style='color: red;'>Yes</font>";
    }
}

//Function Toggle Options Div
function ToggleInformation() {
    $('.controlsContainer').show();
}

//Function: UpdateActiveState
function UpdateActivateState() {
    $('.vehicleMakeModel').text(CheckNull(`${activeVehicle.make} ${activeVehicle.model}`));
    $('.vehicleType').text(`${CheckNull(activeVehicle.type)}`);
    $('.vehicleColour').text(CheckNull(activeVehicle.colour));
    $('.vehicleRegistration').text(CheckNull(activeVehicle.registration));
    $('.vehiclePosition').text(CheckNull(`${activeVehicle.lat}, ${activeVehicle.lon}`));
    $('.vehicleSpeed').text(CheckNull(`${activeVehicle.speed} mph`));
    $('.vehicleStolen').html(CheckNull(`${Stolen(activeVehicle.stolen)}`));

    if (activeVehicle.disabled === 0) {
        $('#disableVehicle').removeClass('btn-success').addClass('btn-danger').text('Disable');
    } else {
        $('#disableVehicle').removeClass('btn-danger').addClass('btn-success').text('Enable');
    }
}

//Function: Update Full Refresh
function UpdateRefresh(delayValue) {
    if (delayValue <= 5) {
        delayValue = 5;
    }

    $('#updateTime').text(`(${delayValue}s)`);
}

//Function: Update RefreshIntervalSlider
function UpdateSlider(delayValue) {
    if (delayValue <= 5) {
        delayValue = 5;
    }

    monitorDelay = delayValue;

    clearTimeout(timer);
    timer = setTimeout(Monitor, monitorDelay * 1000);

    if (monitorDelay == 60) {
        timeValue = '1m';
    } else {
        timeValue = `${monitorDelay}s`;
    }

    $('#monitorRefreshInterval').text(timeValue);
}

//Function: Update Monitor State
function UpdateState() {
    if (monitorState === 0) {
        $('.monitorOptions').show();
        monitorState = 1;
        $('#monitorVehicle').text('Stop').prop('title', 'Stop monitoring the selected vehicle');
        activeMonitor = true;
    } else {
        monitorState = 0;
        $('.monitorOptions').hide();
        $('#monitorVehicle').text('Monitor').prop('title', 'Monitor the selected vehicle');
        vehicleToMonitor = null;
        activeMonitor = false;
        clearTimeout(timer);
    }
}

//Function Update User Theme Preferences
function UserUpdateTheme(){
    
}

//Function: Zoom to Vehicle
function ZoomToVehicle() {
    if (!activeVehicle) {
        return;
    }

    map.setCenter(new google.maps.LatLng(activeVehicle.lat, activeVehicle.lon));
    map.setZoom(17);
}