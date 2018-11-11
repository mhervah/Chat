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
                if (xhr.getResponseHeader("valid") === "password or username isn't correct") {
                    $("#valid").text("password or username isn't correct");
                } else {
                    window.location.replace("/profile.html");
                }
            },
            error: function (xhr) {
                alert("error occurred");
            }
        });
    });

    $(window).keypress(function (e) {
        let key = e.which || e.keyCode;
        if (key === 13) { // 13 is enter
            $("#loginForm").submit();
        }
    });
});