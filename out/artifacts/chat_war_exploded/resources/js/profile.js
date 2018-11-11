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

let interval = setInterval(function () {
    isRead();
    renderUsers(users);
}, 100000);

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
}

function printUserAndNotReadMessage(key) {

    var li = document.createElement("li");
    var spanCount = document.createElement("span");
    li.appendChild(spanCount);
    var spanName = document.createElement("span");

    spanName.onclick = function (e) {
        let username2 = e.toElement.innerHTML;
        // let interval = setInterval(function () {
        //     getMessages(username2);
        // }, 10000);

        if (!isChatsOpen.get(username2 + "Chat")) {
            // getMessages(username2);
            renderMessages(chats, username2);
            createChat(username2);
            isChatsOpen.set(username2 + "Chat", true);
        }
    };

    li.appendChild(spanName);
    li.setAttribute("id", key);
    li.setAttribute("name", key);
    spanCount.setAttribute("name", key);
    spanName.setAttribute("name", key);
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


    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            getMessages(receiver);
            let input = document.getElementById("input" + receiver);
            input.value = "";
        }
    };

    let messageInfo = {
        "receiver": receiver,
        "text": text,
        "date": Date.now()
    };
    xhttp.open("post", "/messages", false);
    xhttp.send(JSON.stringify(messageInfo));
}

function getMessages(user2) {
    let chat = chats.get(user2);
    let lastMessageDate = chat && chat.length > 0 && isChatsOpen.get(user2 + "Chat") ? chat[chat.length - 1]["date"] : 0;
    lastMessageDate = new Date(lastMessageDate);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            renderMessages(data, user2);
            if (chats.has(user2)) {
                chats.set(user2, chats.get(user2).concat(data));
            } else {
                chats.set(user2, data);
            }
        }
    };
    xhttp.open("get", "messages?receiver=" + user2 + "&date=" + lastMessageDate.getTime(), false);
    xhttp.send();
};

function renderMessages(messages, user2) {
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
                deleteMessage(e.path[1].id, username, user2);
            };
            let messageDate = document.createElement("a");
            messageDate.setAttribute("class", "messageDate");
            messageDate.innerText = messages[date]["date"];
            messageDiv.appendChild(messageDate);
            box.appendChild(messageDiv);
            box.scrollTop = box.scrollHeight - box.clientHeight + paragraphElement.clientHeight ;
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