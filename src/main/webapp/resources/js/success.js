/**
 * Created by mher.vahramyan on 10/8/2018.
 */
$(document).ready(function () {

    var table;
    if (getCookie("admin") === "yes") {
        var button = document.createElement("input");
        button.setAttribute("type", "button");
        button.setAttribute("value", "View All Users");
        button.onclick = function () {
            viewAllUsers();
        };
        document.getElementsByClassName("main")[0].appendChild(button);
        var removeBtn = document.createElement("input");
        removeBtn.setAttribute("type", "button");
        removeBtn.setAttribute("value", "Remove");
        document.getElementsByClassName("main")[0].appendChild(removeBtn);
        removeBtn.onclick = function () {
            removeUsers(getSelectedUsers());
        }
    }


    function viewAllUsers() {
        if (document.getElementById("userTable"))
            document.getElementById("userTable").remove();

        table = document.createElement("table");
        table.setAttribute("id", "userTable");
        var tr = document.createElement("tr");
        var th = document.createElement("th");
        var checkbox = document.createElement("input");
        checkbox.setAttribute("type", "checkbox");
        checkbox.setAttribute("id", "selectAll");
        checkbox.setAttribute("style", "width:auto;");
        checkbox.onclick = function () {
            var checkboxes = document.getElementsByClassName("userSelect");
            if (checkbox.checked == true) {
                for (var i = 1; i < checkboxes.length; i++)
                    checkboxes[i].checked = true;
            }
            else {
                for (var i = 1; i < checkboxes.length; i++)
                    checkboxes[i].checked = false;
            }
        };
        th.appendChild(checkbox);
        tr.appendChild(th);
        th = document.createElement("th");
        th.innerHTML = "id";
        tr.appendChild(th);
        th = document.createElement("th");
        th.innerHTML = "username";
        tr.appendChild(th);
        table.appendChild(tr);


            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    if (getCookie("admin") === "yes") {
                        var data = JSON.parse(this.responseText);
                        for (var i = 0; i < data.length; i++) {
                            var tr = document.createElement("tr");
                            var td = document.createElement("td");
                            var checkbox = document.createElement("input");
                            checkbox.setAttribute("type", "checkbox");
                            checkbox.setAttribute("id", data[i].id);
                            checkbox.setAttribute("class", "userSelect");
                            checkbox.setAttribute("style", "width:auto;");
                            if (data[i].id === -1)
                                checkbox.disabled = true;
                            td.appendChild(checkbox);
                            tr.appendChild(td);
                            td = document.createElement("td");
                            td.innerHTML = data[i].id;
                            tr.appendChild(td);
                            td = document.createElement("td");
                            td.innerHTML = data[i].username;
                            tr.appendChild(td);
                            table.appendChild(tr);
                        }
                    }
                }
            };
            xhttp.open("get", "allusers", true);
            xhttp.send();
            document.getElementsByClassName("main")[0].appendChild(table);

    }

    function getSelectedUsers() {
        var selectedUsers = [];
        var selects = document.getElementsByClassName("userSelect")
        for (var i = 0; i < selects.length; i++)
            if (selects[i].checked)
                selectedUsers.push(selects[i].id);
        return selectedUsers;
    }

    function removeUsers(data) {
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                viewAllUsers();
                /* document.getElementById("userTable").innerHTML = "";
                 var data = JSON.parse(this.responseText);
                 /*for (var i = 0; i < data.length; i++) {
                     var tr = document.createElement("tr");
                     var td = document.createElement("td");
                     td.innerHTML = data[i].id;
                     tr.appendChild(td);
                     td = document.createElement("td");
                     td.innerHTML = data[i].username;
                     tr.appendChild(td);
                     table.appendChild(tr);
                 }
     */
            }
        };
        xhttp.open("post", "allusers", true);
        xhttp.setRequestHeader("Content-Type", "json/application");
        xhttp.send(JSON.stringify(data));
    }

    function getCookie(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
});

