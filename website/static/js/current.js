$(document).ready(function() {
    doWork();
});

function doWork() {

    // MAPBOX BASE LAYERS
    var dark_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/dark-v10',
        accessToken: map_api
    });

    var light_layer = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/light-v10',
        accessToken: map_api
    });

    var cityName = ['Dallas', 'Chicago', 'Los Angeles', 'Seattle', 'Orlando', 'Burlington', 'Denver', 'Cincinnati', 'Atlanta', 'Boise'];

    var markers = [];
    var heatArray = [];

    let holdingArr = [];

    for (var i = 0; i < cityName.length; i++) {
        let city = cityName[i]
        var url = `https://community-open-weather-map.p.rapidapi.com/weather?q=${city}&lat=0&lon=0&id=2172797&lang=null&units=imperial`

        const settings = {
            "async": false,
            "crossDomain": true,
            "url": url,
            "method": "GET",
            "headers": {
                "X-RapidAPI-Host": "community-open-weather-map.p.rapidapi.com",
                "X-RapidAPI-Key": API
            }
        };
        
        // setTimeout(()=>{
        $.ajax(settings).done(function (response) {
            holdingArr.push(response);
        });
        // }, 10)
    }

    for (var i = 0; i < holdingArr.length; i++) {
        let data = holdingArr[i];
        let coord = [data['coord']['lat'], data['coord']['lon']];
        let marker = L.marker(coord);


        let toolTip = `${data['name']} <br> ${data['main']['temp']} F`

        marker.bindPopup(toolTip).openPopup();
        markers.push(marker);
        heatArray.push([data['coord']['lat'], data['coord']['lon'], data['main']['temp']]);
    }

     // LAYER GROUPS/LEGEND
     var markerLayer = L.layerGroup(markers);
     var heatLayer = L.heatLayer(heatArray, {
         radius: 75,
         blur: 15
     });

    // Create a baseMaps object.
    var baseMaps = {
        "Dark": dark_layer,
        "Light": light_layer
    };

    // Overlays that can be toggled on or off
    var overlayMaps = {
        Markers: markerLayer,
        HeatMap: heatLayer
    };

    // Create a new map.
    var myMap = L.map("map", {
        center: [37.0902, -95.7129],
        zoom: 5,
        layers: [dark_layer, light_layer, markerLayer, heatLayer]
    });

    // Create a layer control that contains our baseMaps.
    L.control.layers(baseMaps, overlayMaps).addTo(myMap);
}

