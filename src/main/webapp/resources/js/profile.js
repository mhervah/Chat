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
            for (let key in data) {
                var li = document.createElement("li");
                li.setAttribute("id", key);
                li.innerText = key;
                let chatopen = false;
                li.onclick = function (e) {
                    let username2 = e.toElement.id;
                    if (!chatopen) {
                        let div = document.createElement("div");
                        div.setAttribute("id", "chat" + username2);
                        let p = document.createElement("p");
                        p.innerText = username2;
                        p.setAttribute("class", "chatUsername");
                        let close = document.createElement("span");
                        close.innerText = 'x';
                        close.setAttribute("class", "closeButton");
                        close.setAttribute("id", "close" + username2);
                        close.onclick = function (e) {
                            closeChat(username2);
                            chatopen = false;
                            requestMessages(username, username2, chatopen);
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

                        document.getElementById("chats").appendChild(div);
                        chatopen = true;
                        requestMessages(username, username2, chatopen);

                    }
                };
                list.appendChild(li);
            }


        }
    };
    xhttp.open("get", "allusers", true);
    xhttp.send({
        "username": username
    });


});

function closeChat(username) {
    let chat = document.getElementById("chat" + username);
    chat.parentNode.removeChild(chat);

}

function sendMessage(sender, reciever, text) {
    let box = document.getElementById("box" + reciever);
    let input = document.getElementById("input" + reciever);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            console.log("sent");
            getMessages(sender, reciever);
            input.value = "";
        }
    };
    let messageInfo = {
        "sender": sender,
        "reciever": reciever,
        "text": text,
        "date": new Date()
    };
    xhttp.open("post", "/messages", true);
    xhttp.send(JSON.stringify(messageInfo));

}

function getMessages(user1, user2) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            var box = document.getElementById("box" + user2);
            if (box) {
                box.innerHTML = "";
                for (let i = 0; i < data.length; i++) {
                    let messageDiv = document.createElement("div");
                    messageDiv.setAttribute("id", "message" + data[i]["id"]);
                    messageDiv.setAttribute("class", "messageDiv");
                    let paragraphElement = document.createElement("p");
                    if (data[i]["sender"] === user1)
                        paragraphElement.setAttribute("class", "message myMessage");
                    else
                        paragraphElement.setAttribute("class", "message");
                    paragraphElement.setAttribute("id", data[i]["id"]);
                    paragraphElement.innerText = data[i]["text"];
                    messageDiv.appendChild(paragraphElement);
                    let editLink = document.createElement("a");
                    editLink.innerText = "edit";
                    editLink.setAttribute("id", "edit" + data[i]["id"]);
                    editLink.setAttribute("class","editLink");
                    messageDiv.appendChild(editLink);
                    editLink.onclick = edit;
                    let deleteLink = document.createElement("a");
                    deleteLink.innerText = "delete";
                    deleteLink.setAttribute("id", "delete" + data[i]["id"]);
                    deleteLink.setAttribute("class","deleteLink");
                    messageDiv.appendChild(deleteLink);
                    deleteLink.onclick = function (e) {
                        deleteMessage(e.path[1].id, user1, user2);
                    };
                    let messageDate = document.createElement("a");
                    messageDate.setAttribute("class","messageDate");
                    messageDate.innerText = data[i]["date"];
                    messageDiv.appendChild(messageDate);
                    box.appendChild(messageDiv);
                }
            }

        }
    };
    xhttp.open("get", "/messages?user1=" + user1 + "&user2=" + user2, true);
    xhttp.send();

}

function editMessage(id, text, sender, reciever) {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getMessages(sender, reciever);
        }
    };
    xhttp.open("put", "/messages", true);
    let messageInfo = {
        "id": id,
        "text": text,
        "sender": sender,
        "reciever": reciever

    };
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(JSON.stringify(messageInfo));

}

function deleteMessage(id, sender, reciever) {


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getMessages(sender, reciever);
        }
    };
    xhttp.open("delete", "/messages", true);
    let messageInfo = {
        "id": id,
        "sender": sender,
        "reciever": reciever

    };
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(JSON.stringify(messageInfo));

}

function requestMessages(user1, user2, isChatOpen) {
    console.log(isChatOpen);
    if (!isChatOpen)
        return;


    setTimeout(function () {
        if (isChatOpen)
            getMessages(user1, user2);
        else
            return;
        requestMessages(user1, user2, isChatOpen);
    }, 2000);
}

function edit(e) {

    let messageId = e.path[1].id;
    let text = paragraphElement.textContent;
    console.log(text);
    let editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("id", "editInput" + messageId);
    editInput.value = text;
    paragraphElement.innerText = "";
    paragraphElement.appendChild(editInput);
    let saveButton = document.createElement("input");
    saveButton.setAttribute("type", "button");
    saveButton.setAttribute("id", "save" + messageId);
    saveButton.setAttribute("value", "Save");
    saveButton.onclick = function (e) {

        editMessage(messageId, document.getElementById("editInput" + messageId).value, user1, user2);
    };
    paragraphElement.appendChild(saveButton);


};