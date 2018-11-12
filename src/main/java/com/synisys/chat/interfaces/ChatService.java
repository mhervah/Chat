package com.synisys.chat.interfaces;

import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

import java.util.Date;
import java.util.List;
import java.util.Map;

/**
 * Created by mher.vahramyan on 11/6/2018.
 */
public interface ChatService {
    void addMessage(Pair pair, Message message);

    void removeMessage(Pair pair, int messageId);

    void editMessage(Pair pair, int messageId, String newMessage);

    void addChat(Pair pair);

    List<Message> getChat(Pair pair);

    List<Message> getChatFromDate(Pair pair, long date);

    List<Message> getDeleted(Pair pair);

    List<Message> getEdited(Pair pair);

    int notReadMessage(Pair pair, String receiver);

    Map<String, Integer> listNotReadedMessageForSender(String sender);
}
