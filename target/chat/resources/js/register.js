/**
 * Created by mher.vahramyan on 11/1/2018.
 */

$(document).ready(function () {
   $("#registerForm").on("submit",function (e) {
       $("#repeatPasswordValid").text("");
       $("#passwordValid").text("");
       $("#usernameValid").text("");
       e.preventDefault();
       if($("#passwordInput").val()!==$("#repeatPasswordInput").val()){
           $("#repeatPasswordValid").text("Passwords should match");
       }
       else{
           e.preventDefault();
           $.ajax({
               url: "register",
               type: "post",
               data: $(this).serialize(),
               success: function(data, textStatus,xhr) {
                   console.log("got");

                   if(xhr.getResponseHeader("username")==="not valid"){

                       $("#usernameValid").text("Username is not valid");
                   }

                   if(xhr.getResponseHeader("password")==="not valid"){
                       $("#passwordValid").text("Password is not valid");


                   }
                   if(xhr.getResponseHeader("username")!=="not valid" && xhr.getResponseHeader("password")!=="not valid")
                       window.location.replace("/");
               },
               error: function(xhr) {
                   alert("error occurred");
               }
           });
       }


       });
});