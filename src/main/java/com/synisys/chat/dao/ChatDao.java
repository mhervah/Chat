package com.synisys.chat.dao;

import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.*;

import static com.synisys.chat.services.ChatServiceImp.chatService;

/**
 * Created by mher.vahramyan on 11/5/2018.
 */
public class ChatDao {
    public Map<Pair, List<Message>> chats = new HashMap<>();

    public void addChat(Pair pair) {
        chats.put(pair, new ArrayList<Message>());
    }

    public void addMessage(Pair pair, Message message) {
        chats.get(pair).add(message);
    }

    public void removeMessage(Pair pair, int messageId) {
        for (Message message : chats.get(pair)) {
            if (message.getId() == messageId) {
                chats.get(pair).remove(message);
                return;
            }
        }
    }

    public void editMessage(Pair pair, int messageId, String newMessage) {
        for (Message message : chats.get(pair)) {
            if (message.getId() == messageId) {
                message.setText(newMessage);
                message.setEdited(true);
            }
        }
    }

    public  Integer notReadMessage(Pair pair, String receiver) {
        int i = 0;
        List<Message> chat = chats.get(pair); //message of pair
        Iterator<Message> iterator = chat.iterator();
        while (iterator.hasNext()) {
            Message next = iterator.next();
            if (next.isSender(receiver) && next.getIsRead() == false) {
                ++i;
            }
        }
        return i;    // receiver in pair not readed message
    }

    public Map<String, Integer> listNotReadedMessageForSender(String sender) {
        Map<String, Integer> map = new HashMap<>();
        for (Map.Entry<Pair, List<Message>> entry : chats.entrySet()) {
            if (entry.getKey().isUserInPair(sender)) {
                String key = entry.getKey().interceptUser(sender);
                map.put(key, notReadMessage(entry.getKey(), key));
            }
        }
        return map;
    }

    public List<Message> getChat(Pair pair) {
        return chats.get(pair);
    }
}
