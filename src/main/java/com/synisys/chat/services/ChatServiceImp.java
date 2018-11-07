package com.synisys.chat.services;

import com.synisys.chat.dao.ChatDao;
import com.synisys.chat.interfaces.ChatService;
import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by mher.vahramyan on 11/1/2018.
 */
public class ChatServiceImp implements ChatService {
    public static ChatServiceImp chatService = new ChatServiceImp();

    private ChatServiceImp(){

    }

    @Override
    public void addMessage(Pair pair, Message message) {
        ChatDao.addMessage(pair,message);
    }

    @Override
    public void removeMessage(Pair pair, int messageId) {
        ChatDao.removeMessage(pair,messageId);
    }

    @Override
    public void editMessage(Pair pair, int messageId, String newText) {
        ChatDao.editMessage(pair,messageId, newText);
    }

    @Override
    public List<Message> getChat(Pair pair) {
        return ChatDao.getChat(pair);
    }

    @Override
    public void addChat(Pair pair) {
        ChatDao.addChat(pair);
    }

}
