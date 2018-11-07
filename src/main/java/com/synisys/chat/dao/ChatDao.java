package com.synisys.chat.dao;

import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static com.synisys.chat.services.ChatServiceImp.chatService;

/**
 * Created by mher.vahramyan on 11/5/2018.
 */
public class ChatDao {
    public static Map<Pair, List<Message>> chats = new HashMap<>();

    public static void addChat(Pair pair){
        chats.put(pair, new ArrayList<Message>());
    }

    public static void addMessage(Pair pair, Message message){
        chats.get(pair).add(message);
    }

    public static void removeMessage(Pair pair, int messageId){
        for (Message message :chats.get(pair)){
            if (message.getId() == messageId){
                chats.get(pair).remove(message);
                return;
            }
        }
    }

    public static void editMessage(Pair pair, int messageId, String newMessage){
        for (Message message :chats.get(pair)){
            if (message.getId() == messageId){
                message.setText(newMessage);
                message.setEdited(true);
            }
        }
    }


    public static List<Message> getChat(Pair pair){
        return chats.get(pair);
    }
}
