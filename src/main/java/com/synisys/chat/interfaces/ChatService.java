package com.synisys.chat.interfaces;

import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.List;

/**
 * Created by mher.vahramyan on 11/6/2018.
 */
public interface ChatService {
    void addMessage(Pair pair, Message message);
    void removeMessage(Pair pair, int messageId);
    void editMessage(Pair pair, int messageId, String newMessage);
    void addChat(Pair pair);
    List<Message> getChat(Pair pair);
}
