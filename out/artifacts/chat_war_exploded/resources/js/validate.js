document.getElementById("load").onclick = function (ev) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var responseHeader = this.getResponseHeader("valid");
            if (responseHeader) {
                document.getElementById("valid").innerHTML = responseHeader;
            } else {
                if (this.responseText) {
                    window.location.href = this.responseText;
                }
            }
        }
    };
    var namePassword = {
        password: document.getElementById("password").value,
        username: document.getElementById("username").value

    };
    xhttp.open("post", "/login", false);
    xhttp.send(JSON.stringify(namePassword));
};
