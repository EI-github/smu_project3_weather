$(document).ready(function() {
    // doWork();
    $("#refTable").hide();

    $("#submit").on("click", function(){
        doWork();
        requestCurPolAjax()
        $("#refTable").show();
        
    });
});

function doWork() {

    // const cityName = prompt("Please enter a city:");
    var cityName = $("#cityName").val();

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://community-open-weather-map.p.rapidapi.com/weather?q=${cityName}&lat=0&lon=0&id=2172797&lang=null&units=imperial`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Host": "community-open-weather-map.p.rapidapi.com",
            "X-RapidAPI-Key": API
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
        makeTempPlot(response);
        makeHumidityPlot(response);
        makePressurePlot(response);
        updateBackground(response);
    });

}

function makeHumidityPlot(response) {
    let humid = response["main"]["humidity"]

    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: humid,
        title: { text: "Humidity %" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: "50" },
        gauge: {
            axis: { range: [null, 100] },
            bar: { color: "rgb(235,110,75)" },
            steps: [
                { range: [0, 50], color: "lightgray" },
                { range: [50, 70], color: "rgb(72,72,74)" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 95
            }
        }
    };

    var data1 = [trace];

    var layout = {
        title: "Current Humidity"
    };
    Plotly.newPlot("humidity", data1, layout);

}

function makePressurePlot(response) {
    let pressure = response["main"]["pressure"]

    var trace = {
        domain: { x: [0, 1], y: [0, 1] },
        value: pressure,
        title: { text: "Pressure (hPA)" },
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: "1013" },
        gauge: {
            axis: { range: [926, 1100] },
            bar: { color: "rgb(78,167,218)" },
            steps: [
                { range: [926, 1000], color: "lightgray" },
                { range: [1000, 1050], color: "rgb(72,72,74)" }
            ],
            threshold: {
                line: { color: "red", width: 4 },
                thickness: 0.75,
                value: 1085
            }
        }
    
    };

    var data1 = [trace];

    var layout = {
        title: "Current Pressure"
    };
    Plotly.newPlot("pressure", data1, layout);

}

function makeTempPlot(response) {

    var temp = response["main"]["temp"]
    var tempMax = response["main"]["temp_max"]
    var tempMin = response["main"]["temp_min"]
    var city = response["name"]
    var error = tempMax-tempMin

        
    var trace1 = {
        y: [tempMin, temp, tempMax],
        name: city,
        type: 'box',
        marker: {
            color: "rgb(235,110,75)"
        },
        boxmean: true
      };
    
    
    
    
      var data1 = [trace1];
      var layout = {
        title: "Current Temperature (°F)"
    };
      Plotly.newPlot('temperature', data1, layout);
}

function updateBackground(response) {

    let weather = response['weather'][0]['main']

    

}
function requestCurPolAjax() {
    var cityName = $("#cityName").val();
    
   // lat & long request
   const geoSettings = {
    "async": true,
    "crossDomain": true,
    "url": `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`,
    "method": "GET",
    };

    // lat & long response

    $.ajax(geoSettings).done(function (geoResponse) {
        console.log(geoResponse);
        const latitude = geoResponse[0]["lat"].toFixed(2);
        const longitude = geoResponse[0]["lon"].toFixed(2);
        console.log(latitude);
        console.log(longitude);

    var url = `http://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${api_key}`

    var curaqisettings = {
        "async": true,
        "crossDomain": true,
        "url": url,
        "method": "GET"
    };
    
    $.ajax(curaqisettings).done(function (aqiresponse) {
        console.log(aqiresponse);
        aqiPlot(aqiresponse);
    });

function aqiPlot(aqiresponse) {
    let aqi = aqiresponse["list"][0]["main"]["aqi"]
    var trace = {
          type: "indicator",
          mode: "number+gauge+delta",
          value: aqi,
          domain: { x: [0, 1], y: [0, 1] },
          title: { text: "AQI" },
          gauge: {
            bar: {color: "green"},
            shape: "bullet",
            axis: { range: [null, 5] },
            threshold: {
              thickness: 0.75,
              value: 5
            },
            steps: [
              { range: [0, 1], color: "rgba(47, 47, 148, 0.2)" },
              { range: [1, 2], color: "rgba(78,167,218, 0.5)" },
              { range: [2, 3], color: "rgb(180, 130, 130)" },
              { range: [3, 4], color: "rgb(235,110,75)" },
              { range: [4, 5], color: "rgb(245, 77, 29)" }
            ]
        }
    };
      
    var data_plot = [trace]
        
    var layout = { 
        title: "Air Quality Index"
     };
    Plotly.newPlot('curAqi', data_plot, layout);
    
    };
    })
}

