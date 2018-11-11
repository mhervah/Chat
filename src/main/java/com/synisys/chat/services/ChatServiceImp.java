package com.synisys.chat.services;

import com.synisys.chat.dao.ChatDao;
import com.synisys.chat.interfaces.ChatService;
import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.ArrayList;
import java.util.Date;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

/**
 * Created by mher.vahramyan on 11/1/2018.
 */
public class ChatServiceImp implements ChatService {
    public static ChatServiceImp chatService = new ChatServiceImp();
    private ChatDao chatDao;

    private ChatServiceImp() {
        chatDao = new ChatDao();
    }

    @Override
    public void addMessage(Pair pair, Message message) {
        chatDao.addMessage(pair, message);
    }

    @Override
    public void removeMessage(Pair pair, int messageId) {
        chatDao.removeMessage(pair, messageId);
    }

    @Override
    public void editMessage(Pair pair, int messageId, String newText) {
        chatDao.editMessage(pair, messageId, newText);
    }

    @Override
    public List<Message> getChat(Pair pair) {
        return chatDao.getChat(pair);
    }

    @Override
    public void addChat(Pair pair) {
        chatDao.addChat(pair);
    }

    @Override
    public List<Message> getChatFromDate(Pair pair, long date) {
        List<Message> list = new ArrayList<>();
        for (Message message : getChat(pair)) {
            if (date < message.getDate()) {
                list.add(message);
            }
        }
        return list;
    }

    @Override
    public List<Message> getDeleted(Pair pair) {
        List<Message> list = new ArrayList<>();
        for (Message message : chatService.getChat(pair)) {
            if (message.isDeleted())
                list.add(message);
        }
        return list;
    }

    @Override
    public List<Message> getEdited(Pair pair) {
        List<Message> list = new ArrayList<>();
        for (Message message : chatService.getChat(pair)) {
            if (message.isEdited())
                list.add(message);
        }
        return list;
    }

    @Override
    public int notReadMessage(Pair pair, String receiver) {
        int count = 0;
        List<Message> chat = chatDao.getChat(pair); //message of pair
        for (Message message : chat) {
            if (!message.isSender(receiver)) {
                count++;
            }
        }
        return count++; // receiver in pair not readed message
    }

    @Override
    public Map<String, Integer> listNotReadedMessageForSender(String sender) {
        return chatDao.listNotReadedMessageForSender(sender);
    }
}

