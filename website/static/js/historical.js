$(document).ready(function() {
    $("#submit").on("click", function(){
       doWork();    
    });
});

function doWork() {


    var cityName = $("#cityName").val();
    

   // lat & long request
   const geoSettings = {
    "async": true,
    "crossDomain": true,
    "url": `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${HIST_API_KEY}`,
    "method": "GET"
    };

    // lat & long response

    $.ajax(geoSettings).done(function (geoResponse) {
        console.log(geoResponse);
        const latitude = geoResponse[0]["lat"].toFixed(2);
        const longitude = geoResponse[0]["lon"].toFixed(2);
        console.log(latitude);
        console.log(longitude);

        const epochDT = (new Date().getTime())/1000
        const stringEpoch = epochDT.toFixed(0);
        const newURL = `https://community-open-weather-map.p.rapidapi.com/onecall/timemachine?lat=${latitude}&lon=${longitude}&dt=${stringEpoch}`

    

        // weather request
        const settings = {
            "async": true,
            "crossDomain": true,
            "url": newURL,
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

        });

        //-------------------------------------------------------------
        // HISTORICAL POLLUTION/AQI API REQUEST
        var myCurrentDate= (new Date().getTime())/1000;
        var currentDate= myCurrentDate.toFixed(0);
        
        var pastDate = currentDate - 432000;
    
        var url = `http://api.openweathermap.org/data/2.5/air_pollution/history?lat=${latitude}&lon=${longitude}&start=${pastDate}&end=${currentDate}&appid=${api_key}`
    
    
        var Histsettings = {
            "async": true,
            "crossDomain": true,
            "url": url,
            "method": "GET"
        };
        
        $.ajax(Histsettings).done(function (hpresponse) {
            console.log(hpresponse);
            pollutionPlot(hpresponse);
        });
        function compToString(component) {
                var output = `
                co: ${component["co"]}<br>
                nh3: ${component["nh3"]}<br>
                no: ${component["no"]}<br>
                no2: ${component["no2"]}<br>
                o3: ${component["o3"]}<br>
                pm2_5: ${component["pm2_5"]}<br>
                pm10: ${component["pm10"]}<br>
                so2: ${component["so2"]}
                `
                return output;
            };
            
            function pollutionPlot(hpresponse) {
                var data = hpresponse["list"]
                var dates = data.map(x => new Date(x["dt"] * 1000));
                var comp = data.map(x => compToString(x["components"]));
                var colors = [];
                for(i = 0; i < data.length; i++) {
                    val = data[i]['main']['aqi']
                    if (val == 1){
                        colors.push('rgb(78,167,218)')
                    } else if (val ==2){
                        colors.push('rgb(47, 47, 148)')
                    } else if (val ==3){
                        colors.push('rgb(235,110,75)')
                    } else if (val ==4){
                        colors.push('rgb(245, 77, 29)')
                    } 
                }
                console.log(colors)
            
                var trace = {
                    x: dates,
                    y: data.map(x => x["main"]["aqi"]),
                    type: 'bar',
                    text: comp,
                    marker: {
                        color: colors
                    }
                };
                
                var data_plot = [trace];
                
                var layout = {
                    title: 'Air Quality over the Last 5 Days',
                    font:{
                        family: 'Raleway, sans-serif'
                    },
                    showlegend: false,
                    xaxis: {
                        title: "Date Time Stamp",
                        tickangle: -45
                    },
                    yaxis: {
                        title: "Air Quality Index",
                        zeroline: false,
                        gridwidth: 2
                    },
                    bargap :0.05
                };
                
                Plotly.newPlot('histpol', data_plot, layout); 
                
            };
    });
//----------------------------------------------------------------------------------------------------------------------------

}

function makeTempPlot(response) {
    var data = response["hourly"]
    var dates = data.map(x => new Date(x["dt"] * 1000));
    var temps = data.map(x => (((x["temp"])-273.15)*1.8)+32)


    var trace1 = {
        x: dates,
        y: temps,
        mode: 'markers',
        marker: {
            size: 40,
            color: 'rgb(78,167,218)'
        }
    };

    var data = [trace1];

    var layout = {
        title: 'Hourly Historical Temperatures (24 Hours)',
        yaxis: {
            title: "Temp (°F)"
          }
        };

    Plotly.newPlot('temperature', data, layout);
}

function makeHumidityPlot(response) {
    var data = response["hourly"]
    var dates = data.map(x => new Date(x["dt"] * 1000));
    var humid = data.map(x => x["humidity"])


    var trace1 = {
        x: dates,
        y: humid,
        type: 'scatter',
        line: {
            color: 'rgb(235,110,75)',
            width: 5
          }
      };
      
      
    var data = [trace1];

    var layout = {
        title: 'Hourly Historical Humidity (24 Hours)',
        yaxis: {
            title: "Percentage (%)"
          }
    }
      
      Plotly.newPlot('humidity', data, layout);
}
