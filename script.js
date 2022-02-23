const searchResult = document.getElementById("search")
const searchBtn = document.getElementById("btn")
const historySearch = document.querySelector('.history');
const api = "844157dca717a67718c3d267047ebf9b"

var searchHistory = [];//array to hold user search history


searchBtn.addEventListener('click', function() {
    if(searchResult.value){
        var searchedCity = document.createElement('button');
        searchedCity.classList.add('searchedcity');
        searchedCity.textContent = searchResult.value;
        searchHistory.push(searchResult.value);
        historySearch.appendChild(searchedCity);
        console.log(searchHistory);
        getLatLong(searchResult.value);
        save();
        
        console.log(searchedCity.textContent);
        searchedCity.addEventListener('click', function(event){
            event.preventDefault();
            searchResult.value = searchedCity.textContent ;
            console.log(searchResult.value);
            
        })
        
    }
   
})
//saves search history
var save = function(){
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}

var load = function(){
    var savedTask = localStorage.getItem("searchHistory");
    
    if(!savedTask) {
        return false;
    }
    
    savedTask = JSON.parse(savedTask);
    
    for (var i = 0; i < savedTask.length; ++i){
        var searchedCity = document.createElement('button');
        searchedCity.classList.add('searchedcity');
        searchedCity.innerText = savedTask[i];
        historySearch.appendChild(searchedCity);
        searchedCity.addEventListener('click', function(event){
            event.preventDefault();
            searchResult.value = searchedCity.textContent ;
            
        })
        
    }
    
}
load();
console.log(typeof(searchResult.value));

var getLatLong = function(city){
    const baseUrl = 'https://api.openweathermap.org/geo/1.0/direct?q=';
    const API = '&limit=1&appid=844157dca717a67718c3d267047ebf9b';
    fetch(baseUrl + city + API)
    .then(function(response) {
        response.json()
        .then(function(data){
            //getting latitude and longitude for city searched
            getCurrent(data[0].lat, data[0].lon)
            getDaily(data[0].lat, data[0].lon)
            // showForcast(data[0].lat, data[0].lon)
        })
    })
}
//using latidue and longitude to get
var getCurrent = function(lat, lon){
    var baseUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
    var latt = 'lat=' + lat;
    var lonn = '&lon=' + lon;
    var rest = '&exclude=minutely,hourly,alert&units=imperial&appid=844157dca717a67718c3d267047ebf9b';
    fetch(baseUrl + latt + lonn + rest)
    .then(function(response){
        response.json()
        .then(function(data){
            console.log(data.current);
            showCurrent(data.current);
            showCurrentDate(data.current.dt);
        })
    })
}

//displays temp, wind, humidity for current day
var showCurrent = function(data){
    var cityName = document.querySelector(".Currentcity");
    cityName.innerText = searchResult.value;
    var Iconimg = document.querySelector('.icon');
    var IconimgUrl = ' http://openweathermap.org/img/wn/';
    Iconimg.src = IconimgUrl+data.weather[0].icon+'@2x.png';
    var currentTemp = document.querySelector(".temp");
    currentTemp.innerText = "Temp: " + data.temp + " F";
    var currentWind = document.querySelector(".windSpeed");
    currentWind.innerText = "Wind: " + data.wind_speed + " MPH";
    var currentHumidity = document.querySelector(".humidity");
    currentHumidity.innerText = "Humidity: " + data.humidity + "%";
    var currentUV = document.querySelector(".UVIndex");
    currentUV.innerText = "UV Index: " + data.uv;
    searchResult.value = '';  
}

var showCurrentDate = function(date){
    const currentDate = document.querySelector(".date");
    var dateString = moment.unix(date).format("MM/DD/YYYY");
    currentDate.innerText = dateString;
}



var getDaily = function(lat, lon) {
    var baseUrl = 'https://api.openweathermap.org/data/2.5/onecall?';
    var latt = 'lat=' + lat;
    var lonn = '&lon=' + lon;
    var rest = '&exclude=minutely,hourly,current,alert&units=imperial&appid=844157dca717a67718c3d267047ebf9b';
    fetch(baseUrl + latt + lonn + rest)
    .then(function(response){
        response.json()
        .then(function(data){
            console.log(data.daily);
            showForcast(data.daily);
        })
    })
}

var pagecontainer = document.querySelector('.forcast');
var showForcast = function(data) {
    pagecontainer.innerHTML = " ";
    for (var i = 1; i < data.length - 2; ++i){
        
        console.log(data[i])
    
        var eachDay = document.createElement("div");
        eachDay.classList.add("card", "col-lg-2", "col-9");

        var date = document.createElement("h2");
        date.classList.add("forcastDate");
        var dateString = moment.unix(data[i].dt).format("MM/DD/YYYY");
        date.textContent = dateString;

        //temp forcast
        const temp = document.createElement('div');
        temp.classList.add("forcast-detail", "temp");
        temp.textContent = "Temp: " + data[i].temp.day + "F";
        //wind forcast
        const wind = document.createElement('div');
        wind.classList.add("forcast-detail", 'wind');
        wind.textContent = "Wind: " + data[i].wind_speed + " MPH";
        //humidity forcast
        const humidity = document.createElement('div');
        humidity.classList.add("forcast-detail", "humidity");
        humidity.textContent = "Humidity: " + data[i].humidity + "%";

        eachDay.appendChild(date);
        // eachDay.appendChild(img);
        eachDay.appendChild(temp);
        eachDay.appendChild(wind);
        eachDay.appendChild(humidity);
        pagecontainer.appendChild(eachDay);
    }
}
   
