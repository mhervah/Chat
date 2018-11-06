package com.synisys.chat.dao;

import com.synisys.chat.models.Chat;
import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by mher.vahramyan on 11/5/2018.
 */
public class ChatDao {
    public static Map<Pair,Chat> chats = new HashMap<>();

    public static void addChat(Pair pair){
        chats.put(pair,new Chat(pair));
    }

    public static void addMessage(Pair pair, Message message){
        chats.get(pair).addMessage(message);
    }

    public static void removeMessage(Pair pair, Message message){
        chats.get(pair).removeMessage(message);
    }

    public static void editMessage(Message message, String text){
        message.setText(text);
        message.setEdited(true);
    }


    public static Chat getChat(Pair pair){
        return chats.get(pair);
    }
}
