$(document).ready(function() {

    $("#submit").on("click", function(){
        doWork();
        requestForAqiAjax();
    });
});

function doWork() {

    // const cityName = prompt("Please enter a city:");
    var cityName = $("#cityName").val();

    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `https://community-open-weather-map.p.rapidapi.com/climate/month?q=${cityName}&units=imperial`,
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
    });


    
}

function makeTempPlot(response) {
    var data = response["list"]
    var dates = data.map(x => new Date(x["dt"] * 1000));
    var trace1 = {
        x: dates,
        y: data.map(x => x["temp"]["average"]),
        name: "Average",
        mode: 'lines+markers',
        line: {
          color: 'rgb(235,110,75)',
          width: 1
        }
      };
      
      var trace2 = {
        x: dates,
        y: data.map(x => x["temp"]["average_max"]),
        name: "Max Temp",
        mode: 'lines+markers',
        line: {
          color: 'rgb(78,167,218)',
          width: 1
        }
      };
      
      var trace3 = {
        x: dates,
        y: data.map(x => x["temp"]["average_min"]),
        name: "Min Temp",
        mode: 'lines+markers',
        line: {
          color: 'rgb(72,72,74)',
          width: 1
        }
      };
      
      var data_plot = [ trace1, trace2, trace3 ];
      
      var layout = {
        title:`Forecast Temperature Averages Plot for ${response["city"]["name"]}`,
        yaxis: {
          title: "Temp (°F)"
        }
      };
      
      Plotly.newPlot('temperature', data_plot, layout);
}

function makeHumidityPlot(response) {
    var data = response["list"]
    var dates = data.map(x => new Date(x["dt"] * 1000));
    var trace1 = {
        x: dates,
        y: data.map(x => x["humidity"]),
        name: "Humidity",
        mode: 'lines+markers', 
        line: {
          color: 'rgb(78,167,218)',
          width: 1
        }
      };

    var data_plot = [ trace1 ];
    
    var layout = {
    title:`Forecast Humidity Plot for ${response["city"]["name"]}`,
    yaxis: {
      title: "Percentage (%)"
    }
    };
    
    Plotly.newPlot('humidity', data_plot, layout);
}

function makePressurePlot(response) {
    var data = response["list"]
    var dates = data.map(x => new Date(x["dt"] * 1000));
    var trace1 = {
        x: dates,
        y: data.map(x => x["pressure"]),
        name: "Pressure",
        mode: 'lines+markers',
        line: {
          color: 'rgb(235,110,75)',
          width: 1
        }
      };

    var data_plot = [ trace1 ];
    
    var layout = {
    title:`Forecast Pressure Plot for ${response["city"]["name"]}`,
    color: "#EB6E4B",
    yaxis: {
      title: "Hectopascal Pressure Units (hPA)"
    }
    };
    
    Plotly.newPlot('pressure', data_plot, layout);

}

function requestForAqiAjax() {
  var cityName = $("#cityName").val();
    
  // lat & long request
  const geoSettings = {
  "async": true,
  "crossDomain": true,
  "url": `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=1&appid=${api_key}`,
  "method": "GET",
  };

  // lat & long response

  $.ajax(geoSettings).done(function (geoResponse) {
      console.log(geoResponse);
      const latitude = geoResponse[0]["lat"].toFixed(2);
      const longitude = geoResponse[0]["lon"].toFixed(2);
      console.log(latitude);
      console.log(longitude);
  
      var url = `https://api.openweathermap.org/data/2.5/air_pollution/forecast?lat=${latitude}&lon=${longitude}&appid=${api_key}`

      var settings = {
          "async": true,
          "crossDomain": true,
          "url": url,
          "method": "GET"
      };
      
      $.ajax(settings).done(function (response) {
          console.log(response);
          aqiForPlot(response);
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
      return output
      };

  function aqiForPlot(response) {
      var data = response["list"]
      var dates = data.map(x => new Date(x["dt"] * 1000));
      var comp = data.map(x => compToString(x["components"]));
      var trace1 = 
          {
            x: dates,
            y: data.map(x => x["main"]["aqi"]),
            type: 'scatter',
            text: comp
          };

        var data_plot = [trace1]

        var layout = {
          title: `Forecast Air Quality`,
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
      };
        
        Plotly.newPlot('forAqi', data_plot, layout);
      
    };
  })
};