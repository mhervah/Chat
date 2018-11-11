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