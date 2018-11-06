/**
 * Created by mher.vahramyan on 11/2/2018.
 */
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

$(document).ready(function () {
    let username = getCookie("username");
    document.getElementById("username").innerText = username;
    var list = document.getElementById("usersList");

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            var data = JSON.parse(this.responseText);
            for (let key in data){


                if (key !== username) {
                    var li = document.createElement("li");
                    li.setAttribute("id", key);
                    li.innerText = key;
                    let chatopen = false;
                    li.onclick = function (e) {
                        let username2 = e.toElement.id;
                        if (!chatopen) {
                            let div = document.createElement("div");
                            div.setAttribute("id", "chat" + username2);
                            let p =document.createElement("p");
                            p.innerText= username2 ;
                            p.setAttribute("class","chatUsername");
                            let close = document.createElement("span");
                            close.innerText = 'x';
                            close.setAttribute("class", "closeButton");
                            close.setAttribute("id","close"+username2);
                            close.onclick = function (e) {
                                closeChat(username2);
                                chatopen = false;
                            };

                            div.appendChild(p);
                            div.appendChild(close);
                            div.setAttribute("class", "chat");
                            let messageBox = document.createElement("div");
                            messageBox.setAttribute("id", "box" + username2);
                            messageBox.setAttribute("class", "messageBox");
                            div.appendChild(messageBox);
                            let input = document.createElement("input");
                            input.setAttribute("id", "input" + username2);
                            input.setAttribute("type", "text");
                            input.setAttribute("class", "messageInput");
                            div.appendChild(input);
                            let button = document.createElement("input");
                            button.setAttribute("id", "button" + username2);
                            button.setAttribute("type", "button");
                            button.setAttribute("value", "Send");
                            button.setAttribute("class", "messageButton");
                            button.onclick = function (e) {
                                let text = document.getElementById("input" + username2).value;
                                if (text !== "") {
                                    sendMessage(username, username2, text);
                                }
                            };
                            div.appendChild(button);

                            document.body.appendChild(div);
                            getMessages(username, username2);
                            chatopen = true;
                        }
                    };
                    list.appendChild(li);
                }
            }

        }
    };
    xhttp.open("get", "allusers", true);
    xhttp.send({
        "username": username
    });


});
function closeChat(username) {
    let chat = document.getElementById("chat"+username);
    chat.parentNode.removeChild(chat);

}
function sendMessage(sender, reciever, text) {
    let box = document.getElementById("box" + reciever);
    let input = document.getElementById("input" + reciever);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            console.log("sent");
            getMessages(sender,reciever);
            input.value = "";
        }
    };
    let messageInfo = {
        "sender": sender,
        "reciever": reciever,
        "text": text,
        "date": new Date()
    }
    xhttp.open("post", "/messages", true);
    xhttp.send(JSON.stringify(messageInfo));

}
function getMessages(user1, user2) {
    var box = document.getElementById("box" + user2);

    box.innerHTML ="";
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            for (let i = 0; i < data.length; i++) {
                let p = document.createElement("p");
                p.setAttribute("class","message");
                p.innerText = data[i]["text"];
                let span = document.createElement("span");
                span.innerText = " edit";
                span.setAttribute("id",data[i]["id"]);
                p.appendChild(span);
                span.onclick = function (e) {
                    console.log(e.toElement.id);

                };
                box.appendChild(p);
            }
            console.log();
        }
    };
    xhttp.open("get", "/messages?user1=" + user1 + "&user2=" + user2, true);
    xhttp.send();

}