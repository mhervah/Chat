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
}, 1000);

function renderUsers(data) {
    var list = document.getElementById("usersList");
    for (let key in data) {
        var li = document.createElement("li");
        li.setAttribute("id", key);
        li.innerText = key;
        let chatopen = false;
        li.onclick = function (e) {


            let username2 = e.toElement.id;
            let interval = setInterval(function () {
                getMessages(username2);
            }, 500);
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
                button.onclick = function (e) {
                    let text = document.getElementById("input" + username2).value;
                    if (text !== "") {
                        sendMessage(username2, text);
                    }

                };
                div.appendChild(button);

                document.getElementById("chats").appendChild(div);


                if(chats.get(username2)){
                    let map ={
                        "new":chats.get(username2)
                    };
                    renderMessages(map,username2);
                }

                chatopen = true;
            }
        };
        list.appendChild(li);
    }
}


function click(e) {
    var username2 = e.path[1].id.slice(0,-4);
    let text = document.getElementById("input" + username2).value;
    if (text !== "") {
        sendMessage(username2, text);
    }
};


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

    let lastMessageDate = chat && chat.length > 0 ? chat[chat.length - 1]["date"] :  0;
    lastMessageDate = new Date(lastMessageDate);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            let data = JSON.parse(this.responseText);
            renderMessages(data, user2);

            if (chats.has(user2)) {
                chats.set(user2, chats.get(user2).concat(data["new"]));
            } else {
                chats.set(user2, data["new"]);
            }
            lastMessageDate = chat && chat.length > 0 ? chat[chat.length - 1]["date"] :  0;
            lastMessageDate = new Date(lastMessageDate);
        }
    };
    xhttp.open("get", "/messages?user2=" + user2 + "&date=" + (lastMessageDate ? lastMessageDate.getTime() : 0), false);
    xhttp.send();

}
function renderMessages(messages, user2) {
    var box = document.getElementById("box" + user2);
    if (box) {
        if (messages["deleted"]) {
            for (let i = 0; i < messages["deleted"].length; i++) {
                let chat = chats.get(user2);
                for (let index in chat)
                    if (messages["deleted"][i]["id"] === chat[index]["id"]) {
                        chat.splice(index, 1);
                    }
            }
        }
        if (messages["edited"]) {
            for (let i = 0; i < messages["edited"].length; i++) {
                if (chats.get(user2)) {
                    for (let message of chats.get(user2)) {
                        if (messages["edited"][i]["id"] === message["id"]) {
                            if (messages["edited"][i]["text"] !== message["text"]) {

                                message["text"] = messages["edited"][i]["text"];
                                let editedMessageText = document.getElementById(message["id"]);
                                if (editedMessageText) {

                                    editedMessageText.innerText = messages["edited"][i]["text"];
                                    let img = document.createElement("img");
                                    img.setAttribute("src", "resources\\images\\hippo.png");
                                    img.setAttribute("width", "40");
                                    img.setAttribute("height", "40");
                                    editedMessageText.appendChild(img);
                                }
                                message["edited"] = true;
                            }
                        }
                    }
                }
            }
        }
        if (messages["new"]) {
            console.log(1);
            for (let i = 0; i < messages["new"].length; i++) {
                let messageDiv = document.createElement("div");
                messageDiv.setAttribute("id", "message" + messages["new"][i]["id"]);

                let paragraphElement = document.createElement("p");
                if (messages["new"][i]["sender"] === username) {
                    paragraphElement.setAttribute("class", "message myMessage");
                    messageDiv.setAttribute("class", "messageDiv myMessageDiv");
                } else {
                    messageDiv.setAttribute("class", "messageDiv");
                    paragraphElement.setAttribute("class", "message");
                }
            }
        }
    }
}

function renderUsers(data) {
    var list = document.getElementById("usersList");
    for (let key in data) {
        var li = document.createElement("li");
        li.setAttribute("id", key);
        li.innerText = key;
        let chatopen = false;
        li.onclick = function (e) {


            let username2 = e.toElement.id;
            let interval = setInterval(function () {
                getMessages(username2);
            }, 500);
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


                if(chats.get(username2)){
                    let map ={
                        "new":chats.get(username2)
                    };
                    renderMessages(map,username2);
                }

                chatopen = true;
            }
        };
        list.appendChild(li);
    }
}

function editMessage(id, text, reciever) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            for (let message of chats.get(reciever)) {
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
            let deletedMessage = document.getElementById("message"+id);
            deletedMessage.parentNode.removeChild(deletedMessage);
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

function edit(e, user2, messageId) {
    let messageDiv =  document.getElementById("message" + messageId);
    let paragraphElement = document.getElementById(messageId);


    let text = paragraphElement.textContent;

    let editInput = document.createElement("input");
    editInput.setAttribute("type", "text");
    editInput.setAttribute("id", "editInput" + messageId);
    editInput.value = text;
    paragraphElement.innerText = "";

    let saveButton = document.createElement("input");
    saveButton.setAttribute("type", "button");
    saveButton.setAttribute("id", "save" + messageId);
    saveButton.setAttribute("value", "Save");
    paragraphElement.appendChild(editInput);
    saveButton.onclick = function (e) {
        let newText = document.getElementById("editInput" + messageId).value;
        editMessage(messageId, newText, user2);
        paragraphElement.innerText = newText;
    };
    paragraphElement.appendChild(saveButton);


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
