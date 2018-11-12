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
let username = getCurrentUser();
$(document).ready(function () {


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
            var data = JSON.parse(this.responseText);
            renderUsers(data);
        }
    };
    xhttp.open("get", "allusers", true);
    xhttp.send();
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
        if(messages["deleted"]){
            for (let i = 0; i < messages["deleted"].length; i++) {
                let chat = chats.get(user2);
                for (let index in chat)
                    if (messages["deleted"][i]["id"] === chat[index]["id"]) {
                        chat.splice(index, 1);
                    }
            }
        }
        if(messages["edited"]) {
            for (let i = 0; i < messages["edited"].length; i++) {
                if (chats.get(user2)) {
                    for (let message of chats.get(user2)) {
                        if (messages["edited"][i]["id"] === message["id"]) {
                            if (messages["edited"][i]["text"] !== message["text"]) {

                                message["text"]= messages["edited"][i]["text"];
                                let editedMessageText = document.getElementById(message["id"]);
                                if(editedMessageText){

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
        if(messages["new"]){
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

                paragraphElement.setAttribute("id", messages["new"][i]["id"]);
                paragraphElement.innerText = messages["new"][i]["text"];
                messageDiv.appendChild(paragraphElement);
                let editLink = document.createElement("a");
                editLink.innerText = "edit";
                editLink.setAttribute("id", "edit" + messages["new"][i]["id"]);
                editLink.setAttribute("class", "editLink");
                messageDiv.appendChild(editLink);
                editLink.onclick = function (e) {
                    let id = e.path[1].id;
                    id = id.substr("message".length, id.length - 6);
                    edit(e, user2, id);
                };
                let deleteLink = document.createElement("a");
                deleteLink.innerText = "delete";
                deleteLink.setAttribute("id", "delete" + messages["new"][i]["id"]);
                deleteLink.setAttribute("class", "deleteLink");
                messageDiv.appendChild(deleteLink);
                deleteLink.onclick = function (e) {
                    let id = e.path[1].id;

                    id = id.substr("message".length, id.length - 6);
                    deleteMessage(id, user2);
                };
                let messageDate = document.createElement("a");
                messageDate.setAttribute("class", "messageDate");
                let date = new Date(messages["new"][i]["date"]);
                messageDate.innerText = date.getDate() + "/" + date.getMonth() + " " + date.getHours() + ":" + date.getMinutes();
                messageDiv.appendChild(messageDate);
                box.appendChild(messageDiv);
            }
        }

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