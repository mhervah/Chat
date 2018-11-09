package com.synisys.chat.services;

import com.synisys.chat.dao.MessageDao;
import com.synisys.chat.models.Message;

public class MessageService {
    public static  MessageService messageService = new MessageService();
    public void addMessage(Message message){
        MessageDao.messages.add(message);
    }
}
