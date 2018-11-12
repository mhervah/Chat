/**
 * Created by mher.vahramyan on 11/2/2018.
 */

let chats = new Map();
let isChatsOpen = new Map();
let username;
let users;
let notReadMessage = [];

$(document).ready(function () {

    getCurrentUser();
    isRead();
    getUsers();

});

function getCurrentUser() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            username = JSON.parse(this.responseText);
            document.getElementById("owner").innerText = username;
        }
    };
    xhttp.open("get", "/login", false);
    xhttp.send();
}

function getUsers() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            users = JSON.parse(this.responseText);
            renderUsers(users);
        }
    };
    xhttp.open("get", "allUsers", true);
    xhttp.send();
}

let interval1 = setInterval(function () {
    isRead();
    renderUsers(users);
}, 1000);

function renderUsers(data) {
    document.getElementById("owner").innerText = username;
    var list = document.getElementById("usersList");
    list.innerHTML = "";
    for (let key in data) {
        var li = printUserAndNotReadMessage(key, list);
        list.appendChild(li);
    }
}

function createChat(username2) {
    let chat = document.getElementById("chats");
    let div = document.createElement("div");
    chat.appendChild(div);
    div.setAttribute("id", username2 + "chat");
    let p = document.createElement("p");
    p.innerText = username2;
    p.setAttribute("class", "chatUsername");
    let close = document.createElement("span");
    close.innerText = 'x';
    close.setAttribute("class", "closeButton");
    close.setAttribute("id", "close" + username2);
    isChatsOpen.set(username2 + "Chat", true);
    close.onclick = function () {
        closeChat(username2);
        isChatsOpen.set(username2 + "Chat", false);
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

    input.addEventListener("keyup", function(event) {
        if (event.key === "Enter") {
            click(event);
        }
    });

    let button = document.createElement("input");
    button.setAttribute("id", "button" + username2);
    button.setAttribute("type", "button");
    button.setAttribute("value", "Send");
    button.setAttribute("class", "messageButton");
    button.onclick = click;
    div.appendChild(button);
}

function click(e) {
    var username2 = e.path[1].id.slice(0,-4);
    let text = document.getElementById("input" + username2).value;
    if (text !== "") {
        sendMessage(username2, text);
    }
};

function printUserAndNotReadMessage(key) {

    var li = document.createElement("li");
    var spanCount = document.createElement("span");
    spanCount.setAttribute("class", "span");
    var spanName = document.createElement("span");


    spanName.onclick = function (e) {

        let username2 = e.toElement.innerHTML;
        let interval = setInterval(function () {
            getMessages(username2);
        }, 2000);

        if (!isChatsOpen.get(username2 + "Chat")) {
            createChat(username2);
            if (chats.has(username2)) {
                renderMessages(chats.get(username2), username2);
            } else {
                getMessages(username2);
            }
            isChatsOpen.set(username2 + "Chat", true);
        }
    };

    li.appendChild(spanName);
    li.setAttribute("id", key);
    li.setAttribute("name", key);
    spanCount.setAttribute("name", key);
    spanName.setAttribute("name", key);
    li.appendChild(spanCount);
    var notReadMessageElement = notReadMessage[key];
    if (notReadMessageElement && (key in notReadMessage)) {
        spanCount.innerText = notReadMessageElement;
    }
    spanName.innerText = key;
    return li;
}

function closeChat(username) {

    let chat = document.getElementById(username + "chat");
    chat.remove();
}

function sendMessage(receiver, text) {

    let input = document.getElementById("input" + receiver);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getMessages(receiver);
            input.value = "";
        }
    };

    let messageInfo = {
        "receiver": receiver,
        "text": text,
        "date": new Date().getTime()
    };
    xhttp.open("post", "/messages", false);
    xhttp.send(JSON.stringify(messageInfo));
}


function getMessages(user2) {
    let chat = chats.get(user2);
    let lastMessageDate = chat && chat.length > 0 ? chat[chat.length - 1]["date"] : 0;
    lastMessageDate = new Date(lastMessageDate);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);

            if (chats.has(user2)) {
                chats.set(user2, chats.get(user2).concat(data));
            } else {
                chats.set(user2, data);
            }
            renderMessages(data, user2);
        }
    };
    xhttp.open("get", "messages?receiver=" + user2 + "&date=" + lastMessageDate.getTime(), false);
    xhttp.send();
};

function renderMessages(messages, user2) {
    let box = document.getElementById("box" + user2);
    if (box) {
        for (let date in messages) {
            let messageDiv = document.createElement("div");
            let messageText = document.createElement("div");
            messageText.setAttribute("id", "text" + messages[date]["id"]);
            messageDiv.setAttribute("id", messages[date]["id"]);
            messageDiv.setAttribute("class", "messageDiv");
            let divElement = document.createElement("div");
            if (messages[date]["sender"] === user2)
                divElement.setAttribute("class", "message myMessage");
            else
                divElement.setAttribute("class", "message");
            divElement.setAttribute("id", messages[date]["id"]+"Message");
            divElement.appendChild(messageText)
            messageText.innerText = messages[date]["text"];
            messageDiv.appendChild(divElement);
            if(messages[date]["receiver"]!= username){
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
                    deleteMessage(e.path[1].id, username, user2);
                };
            }

            let messageDate = document.createElement("a");
            messageDate.setAttribute("class", "messageDate");
            messageDate.innerText = messages[date]["date"];
            messageDiv.appendChild(messageDate);
            box.appendChild(messageDiv);
            box.scrollTop = box.scrollHeight - box.clientHeight + divElement.clientHeight;
        }
    }
}

function editMessage(id, text, reciever) {

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            for (let message in chats.get(reciever)) {
                if (chats.get(reciever)[message]["id"] == id) {
                    chats.get(reciever)[message]["text"] = text;
                    document.getElementById(id+"Message").innerText = text;
                    return;
                }
            }
        }
    };
    let messageInfo = {
        "id": id,
        "text": text,
        "receiver": reciever

    };
    xhttp.open("put", "/messages", true);
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
        "receiver": reciever

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

function edit(e) {

    let messageId = e.path[1].id;
    let paragraphElement = e.path[1].childNodes[0];
    let user2 = e.path[3].id;
    user2 = user2.slice(0,-4);
    let text = paragraphElement.textContent;
    let editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("id", "editInput" + messageId);
    editInput.value = text;
    var elementById = document.getElementById(messageId+"Message");
    paragraphElement.appendChild(editInput);
    let saveButton = document.createElement("input");
    saveButton.setAttribute("type", "button");
    saveButton.setAttribute("id", "save" + messageId);
    saveButton.setAttribute("value", "Save");
    saveButton.onclick = function (e) {
        let newText = document.getElementById("editInput" + messageId).value;
        editMessage(messageId, newText, user2);
        elementById.innerText = newText;
        paragraphElement.remove(editInput);
        paragraphElement.remove(saveButton);
    };
    paragraphElement.appendChild(saveButton);
}