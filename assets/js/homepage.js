var getWebCam = function(symbol) {
    var apiUrl = "https://webcamstravel.p.rapidapi.com/webcams/list/nearby=27.5064,-99.5075,20?lang=en&show=webcams%3Aimage%2Clocation";
    var options = {
        method: 'GET',
        headers: {
            'X-RapidAPI-Key': 'f660f9d47fmshf086d0e64e87eb8p1be187jsnb542a0848fae',
            'X-RapidAPI-Host': 'webcamstravel.p.rapidapi.com'
        }
    };
    fetch(apiUrl, options).then(function(response){
        response.json().then(function(data){
            console.log(data);
        });
    })
};

getWebCam();