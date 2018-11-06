package com.synisys.chat.interfaces;

import com.synisys.chat.models.Chat;
import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;

/**
 * Created by mher.vahramyan on 11/6/2018.
 */
public interface ChatService {
    void addMessage(Pair pair, Message message);
    void deleteMessage(Pair pair, Message message);
    void editMessage(Message message, String text);

}
