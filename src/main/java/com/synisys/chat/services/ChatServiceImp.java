package com.synisys.chat.services;

import com.synisys.chat.dao.ChatDao;
import com.synisys.chat.interfaces.ChatService;
import com.synisys.chat.models.Chat;
import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

/**
 * Created by mher.vahramyan on 11/1/2018.
 */
public class ChatServiceImp implements ChatService {
    public static ChatServiceImp chatService = new ChatServiceImp();

    private ChatServiceImp(){

    }
    public void addMessage(Chat chat, Message message){
        chat.addMessage(message);
    }

    @Override
    public void addMessage(Pair pair, Message message) {
        ChatDao.addMessage(pair,message);
    }

    @Override
    public void deleteMessage(Pair pair, Message message) {
        ChatDao.removeMessage(pair,message);
    }

    @Override
    public void editMessage(Message message, String text) {
        ChatDao.editMessage(message, text);
    }
}
