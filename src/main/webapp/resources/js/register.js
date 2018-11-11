/**
 * Created by mher.vahramyan on 11/1/2018.
 */

$(document).ready(function () {
   $("#registerForm").on("submit",function (e) {
       $("#repeatPasswordValid").text("");
       $("#passwordValid").text("");
       $("#usernameValid").text("");
       e.preventDefault();
       $.ajax({
           url: "register",
           type: "post",
           data: $(this).serialize(),
           success: function(data, textStatus,xhr) {

               if(xhr.getResponseHeader("username")==="username is already in use"){
                   $("#usernameValid").text("username is already in use");
               }

               if(xhr.getResponseHeader("username")==="passwords don't match"){
                   $("#passwordValid").text("password don't match");

               }
               if(xhr.getResponseHeader("username")!=="username is already in use"
                   && xhr.getResponseHeader("username")!=="passwords don't match")
                   window.location.replace("/");
           },
           error: function(xhr) {
               alert("error occurred");
           }
       });
       });

    $(window).keypress(function (e) {
        var key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            $("#registerForm").submit();
        }
    });
});