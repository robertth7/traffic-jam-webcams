var displayCamEl = document.querySelector("#webcam-container");

// // modal was triggered
// $("#search-form-modal").on("show.bs.modal", function(){
//     // clear values
//     $("#modalSearchDescription").val("");
// });

// // modal is fully visible
// $("#search-form-modal").on("shown.bs.modal", function(){
//     // highlight textarea
//     $("#modalSearchDescription").trigger("focus");
// });

// // submit button in modal was clicked
// $("#search-form-modal .btn-submit").click(function(){
//     // get form values
//     var searchText = $("#modalSearchDescription").val();

//     if (searchText) {
//         getCoord(searchText);

//         // close modal
//         $("#search-form-modal").modal("hide");
//     }
// });

"use strict";

function initMap() {
  const CONFIGURATION = {
    "ctaTitle": "Submit",
    "mapOptions": {"center":{"lat":37.4221,"lng":-122.0841},"fullscreenControl":true,"mapTypeControl":false,"streetViewControl":true,"zoom":11,"zoomControl":true,"maxZoom":22,"mapId":""},
    "mapsApiKey": "AIzaSyBTHLq_kPRTCmv3cXWPXrXTsf_7GCDvuXM",
    "capabilities": {"addressAutocompleteControl":true,"mapDisplayControl":false,"ctaControl":true}
  };
  const componentForm = [
    'location',
    'locality',
    'administrative_area_level_1',
    'country',
    'postal_code',
  ];

  const getFormInputElement = (component) => document.getElementById(component + '-input');
  const autocompleteInput = getFormInputElement('location');
  const autocomplete = new google.maps.places.Autocomplete(autocompleteInput, {
    fields: ["address_components", "geometry", "name"],
    types: ["address"],
  });
  autocomplete.addListener('place_changed', function () {
    const place = autocomplete.getPlace();
    // send const place data into getCoord() to send coordinate info
    getCoord(place);
    // console.log(place.geometry.location.lat());
    // console.log(place.geometry.location.lng());
    if (!place.geometry) {
      // User entered the name of a Place that was not suggested and
      // pressed the Enter key, or the Place Details request failed.
      window.alert('No details available for input: \'' + place.name + '\'');
      return;
    }
    fillInAddress(place);
  });

  function fillInAddress(place) {  // optional parameter
    const addressNameFormat = {
      'street_number': 'short_name',
      'route': 'long_name',
      'locality': 'long_name',
      'administrative_area_level_1': 'short_name',
      'country': 'long_name',
      'postal_code': 'short_name',
    };
    const getAddressComp = function (type) {
      for (const component of place.address_components) {
        if (component.types[0] === type) {
          return component[addressNameFormat[type]];
        }
    }
    return '';
};
    getFormInputElement('location').value = getAddressComp('street_number') + ' '
              + getAddressComp('route');
    for (const component of componentForm) {
      // Location field is handled separately above as it has different logic.
      if (component !== 'location') {
        getFormInputElement(component).value = getAddressComp(component);
        console.log(getFormInputElement('location').value);
      }
    }
  }
}

// we will create this function to get coordinates
// we will also use this function to hide the modal when user has selected address
var getCoord = function(data){
    console.log(data);

    var gotCoord = data;

    // hide modal once user enters address
    if (gotCoord) {
        $("#search-form-modal").modal("hide");
    }

    getWebApi(data);
};

var getWebApi = function(data) {
    // console.log(data);
    // I believe an if statement here can get rid of the errors. maybe if (coord) then var(lat,lon)...
    var lat = data.geometry.location.lat();
    // console.log(lat);
    var lon = data.geometry.location.lng();

    var apiUrl = "https://webcamstravel.p.rapidapi.com/webcams/list/nearby=" + lat + "," + lon + ",5?lang=en&show=webcams%3Aimage%2Clocation";
    console.log(apiUrl);
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f660f9d47fmshf086d0e64e87eb8p1be187jsnb542a0848fae',
            'X-RapidAPI-Host': 'webcamstravel.p.rapidapi.com'
        }
    };
    fetch(apiUrl, options).then(function(response){
        console.log(response);
        response.json().then(function(data){
            console.log(data);
            createCams(data);
        });
    })
};

var createCams = function(data) {
    console.log(data);

    // clear old displayed content when user searches again
    displayCamEl.textContent = "";

    // loop over webcams data
    for (var i = 0; i < data.result.webcams.length; i++) {
        // console below lets me know if we caught array of webcams
        console.log(i);
        
        var displayCam = data.result.webcams[i].image.current.preview;
        console.log(displayCam);

        // created a div with class card to be able to change how the images will be displayed on page
        var unListEl = document.createElement("div");
        unListEl.classList = "card";

        // create element for the cam previews
        var listEl = document.createElement("img");
        listEl.src = displayCam;
        console.log(listEl);

        // var nameEl = document.createElement("span");
        // nameEl.textContent = "webcam";

        unListEl.appendChild(listEl);

        // append to element
        displayCamEl.appendChild(unListEl);
    }     

};

$('#myModal').on('shown.bs.modal', function () {
  $('#myInput').trigger('focus')
})

getWebApi();