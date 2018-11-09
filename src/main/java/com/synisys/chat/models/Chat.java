package com.synisys.chat.models;

import javax.jws.soap.SOAPBinding;
import java.util.ArrayList;

/**
 * Created by mher.vahramyan on 11/1/2018.
 */
public class Chat {
    private User user1;
    private User user2;
    private ArrayList<Message> messageList = new ArrayList<>();

    public Chat(User user1, User user2) {
        this.user1 = user1;
        this.user2 = user2;
    }

    public User getUser2() {
        return user2;
    }

    public User getUser1() {
        return user1;
    }

    public void addMessage(Message newMessage) {
        messageList.add(newMessage);
    }

    public ArrayList<Message> getMessagelist() {
        return messageList;
    }
}
