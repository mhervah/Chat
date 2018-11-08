function validate() {
    var username = document.getElementsByClassName("username")[0].value;
    var password = document.getElementsByClassName("password")[0].value;

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            if(this.getResponseHeader("validation")==="part"){
                document.getElementsByClassName("password")[0].value="";
            }else if(this.getResponseHeader("validation")==="no"){
                document.getElementsByClassName("username")[0].value="";
                document.getElementsByClassName("password")[0].value="";
            }
        }
    };

    xhttp.open("post", "validate", true);
    xhttp.setRequestHeader("Content-type","json/application");
    var user={
        "username":username,
        "password":password
    };

    xhttp.send(JSON.stringify(user));
}