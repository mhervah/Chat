/**
 * Created by mher.vahramyan on 11/1/2018.
 */

$(document).ready(function () {
   $("#registerForm").on("submit",function (e) {
       console.log($("#repeatPasswordValid").value);
       if($("#repeatPasswordValid").value && $("#passwordValid").value && $("#usernameValid").value){
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
                       $("#passwordValid").text("passwords don't match");

                   }
                   if(xhr.getResponseHeader("username")!=="username is already in use"
                       && xhr.getResponseHeader("username")!=="passwords don't match")
                       window.location.replace("/");
               },
               error: function(xhr) {
                   alert("error occurred");
               }
           });
       }

       });
});