// document.getElementById("load").onclick = function (ev) {
//     var xhttp = new XMLHttpRequest();
//     xhttp.onreadystatechange = function () {
//         if (this.readyState == 4 && this.status == 200) {
//             var responseHeader = this.getResponseHeader("valid");
//             if (responseHeader) {
//                 document.getElementById("valid").innerHTML = responseHeader;
//             } else {
//                 if (this.responseText) {
//                     window.location.href = this.responseText;
//                 }
//             }
//         }
//     };
//     var namePassword = {
//         password: document.getElementById("password").value,
//         username: document.getElementById("username").value
//
//     };
//     xhttp.open("post", "/login", false);
//     xhttp.send(JSON.stringify(namePassword));
// };

$(document).ready(function () {
    $("#loginForm").on("submit", function (e) {
        $("#username").text("");
        $("#password").text("");
        e.preventDefault();
        $.ajax({
            url: "login",
            type: "post",
            data: $(this).serialize(),
            success: function (data, textStatus, xhr) {
                if (xhr.getResponseHeader("username") === "password or username don't correct") {
                    $("#valid").text("password or username don't correct");
                } else {
                    window.location.replace("/profile.html");
                }
            },
            error: function (xhr) {
                alert("error occurred");
            }
        });
    });
});