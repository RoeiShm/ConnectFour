function sendHttpGetRequest(url, callback) {
    let httpRequest = new XMLHttpRequest();
    httpRequest.onreadystatechange = () => {
        if (httpRequest.readyState == 4) { //the HTTP request has completed
            if (httpRequest.status == 200) { //the HTTP request was successful
                callback(httpRequest.responseText);
            }
        }
    };
    httpRequest.open("GET", url, true);
    httpRequest.send();
}