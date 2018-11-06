package com.synisys.chat.models;

import javax.jws.soap.SOAPBinding;
import java.util.ArrayList;

import static com.synisys.chat.dao.ChatDao.chats;

/**
 * Created by mher.vahramyan on 11/1/2018.
 */
public class Chat {
    private Pair pair;
    private ArrayList<Message> messageList = new ArrayList<>();

    public Chat(Pair pair) {
        this.pair = pair;
    }

    public Pair getPair() {
        return pair;
    }

    public void addMessage(Message newMessage) {
        messageList.add(newMessage);
    }

    public void removeMessage(Message newMessage) {
        messageList.remove(newMessage);
    }

    public ArrayList<Message> getMessagelist() {
        return messageList;
    }
}
