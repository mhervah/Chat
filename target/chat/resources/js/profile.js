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

let chats = new Map();
let isChatsOpen = new Map();
let username = getCurrentUser();
let users;
let notReadMessage;

$(document).ready(function () {

    isRead();
    getUsers();

});
function getCurrentUser() {
    let username;
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

            let data = JSON.parse(this.responseText);
            document.getElementById("username").innerText = data;
            username = data;
        }
    };
    xhttp.open("get", "/login", false);
    xhttp.send();
    return username;

}

function getUsers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            users = JSON.parse(this.responseText);
            renderUsers(users);
        }
    };
    xhttp.open("get", "allusers", true);
    xhttp.send();
}

let interval = setInterval(function () {
    isRead();
    renderUsers(users);
}, 10000);

function renderUsers(data) {
    var list = document.getElementById("usersList");
    list.innerHTML = "";
    for (let key in data) {
        var li = document.createElement("li");
        li.setAttribute("id", key);
        if (notReadMessage && notReadMessage[key] && key in notReadMessage) {
            li.innerText = key + "   " + notReadMessage[key];
        } else {
            li.innerText = key;
        }
        isChatsOpen.set(notReadMessage[key], false);
        li.onclick = function (e) {
            let username2 = e.toElement.id;
            let interval = setInterval(function () {
                getMessages(username2);
            }, 500);
            if (!isChatsOpen.get(e.toElement.textContent)) {
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
                    isChatsOpen.set(e.toElement.textContent, false)
                    clearInterval(interval);
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
                        sendMessage(username2, text);
                    }

                };
                div.appendChild(button);

                document.getElementById("chats").appendChild(div);
                isChatsOpen.set(e.toElement.textContent, true)
            }
        };
        list.appendChild(li);
    }
}
function closeChat(username) {
    let chat = document.getElementById("chat" + username);
    chat.parentNode.removeChild(chat);
}

function sendMessage(reciever, text) {
    let box = document.getElementById("box" + reciever);
    let input = document.getElementById("input" + reciever);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getMessages(reciever);
            input.value = "";
        }
    };
    let messageInfo = {
        "reciever": reciever,
        "text": text,
        "date": Date.now()
    };
    xhttp.open("post", "/messages", true);
    xhttp.send(JSON.stringify(messageInfo));

}

function getMessages(user2) {
    let chat = chats.get(user2);

    let lastMessageDate = chat && chat.length > 0 ? chat[chat.length - 1]["date"] : 0;
    lastMessageDate = new Date(lastMessageDate);
    //console.log(typeof lastMessageDate);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            renderMessages(data, user2);
            //console.log(data);
            if (chats.has(user2)) {
                chats.set(user2, chats.get(user2).concat(data));
            } else {
                chats.set(user2, data);
            }
            lastMessageDate = chat && chat.length > 0 ? chat[chat.length - 1]["date"] : 0;
            lastMessageDate = new Date(lastMessageDate);
            console.log(lastMessageDate);
        }
    };
    xhttp.open("get", "/messages?user2=" + user2 + "&date=" + (lastMessageDate ? lastMessageDate.getTime() : 0), false);
    xhttp.send();

}
function renderMessages(messages, user2) {
    var box = document.getElementById("box" + user2);
    if (box) {
        for (let date in messages) {
            let messageDiv = document.createElement("div");
            messageDiv.setAttribute("id", "message" + messages[date]["id"]);
            messageDiv.setAttribute("class", "messageDiv");
            let paragraphElement = document.createElement("p");
            if (messages[date]["sender"] === user2)
                paragraphElement.setAttribute("class", "message myMessage");
            else
                paragraphElement.setAttribute("class", "message");
            paragraphElement.setAttribute("id", messages[date]["id"]);
            paragraphElement.innerText = messages[date]["text"];
            messageDiv.appendChild(paragraphElement);
            let editLink = document.createElement("a");
            editLink.innerText = "edit";
            editLink.setAttribute("id", "edit" + messages[date]["id"]);
            editLink.setAttribute("class", "editLink");
            messageDiv.appendChild(editLink);
            editLink.onclick = edit;
            let deleteLink = document.createElement("a");
            deleteLink.innerText = "delete";
            deleteLink.setAttribute("id", "delete" + messages[date]["id"]);
            deleteLink.setAttribute("class", "deleteLink");
            messageDiv.appendChild(deleteLink);
            deleteLink.onclick = function (e) {
                deleteMessage(e.path[1].id, user1, user2);
            };
            let messageDate = document.createElement("a");
            messageDate.setAttribute("class", "messageDate");
            messageDate.innerText = messages[date]["date"];
            messageDiv.appendChild(messageDate);
            box.appendChild(messageDiv);
        }
    }
}

function editMessage(id, text, reciever) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            for (let message in chats.get(reciever)) {
                if (message["id"] === id) {
                    message["text"] = text;
                    document.getElementById(id).innerText = text;
                    return;
                }
            }
        }
    };
    xhttp.open("put", "/messages", true);
    let messageInfo = {
        "id": id,
        "text": text,
        "reciever": reciever

    };
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(JSON.stringify(messageInfo));

}

function deleteMessage(id, reciever) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {

        }
    };
    xhttp.open("delete", "/messages", true);
    let messageInfo = {
        "id": id,
        "reciever": reciever

    };
    xhttp.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhttp.send(JSON.stringify(messageInfo));

}

function isRead() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            notReadMessage = JSON.parse(this.responseText);
        }
    };
    xhttp.open("get", "state", true);
    xhttp.send();
}

function edit(e, user2) {
    let messageId = e.path[1].id;
    let paragraphElement = document.getElementById(messageId);

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
        let newText = document.getElementById("editInput" + messageId).value;
        editMessage(messageId, newText, user2);
        paragraphElement.innerText = newText;
        paragraphElement.removeChild(editInput);
        paragraphElement.removeChild(saveButton);
    };
    paragraphElement.appendChild(saveButton);


}