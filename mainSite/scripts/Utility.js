function ajaxRequest(url, params, method, sync) {
    /* 
    * @param {url} STRING the intended site
    * @param {params} STRING parameter names and values serialized
    * @param {method} STRING GET or POST
    * @param {sync} BOOL true for asyncronous
    */
    var xmlHttp = null;
    url += "?"
    var package = null;
    xmlHttp = new XMLHttpRequest();
    switch(method) {
        case "GET":
            url += params;
            break;
        case "POST":
           	package = params;
           	break;
        default:
            alert("Invalid method");
            return;
    }
    xmlHttp.open(method, url, sync);
    xmlHttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlHttp.send(package);
    return xmlHttp.responseText;
}