package com.synisys.chat.interfaces;

import com.synisys.chat.models.User;

/**
 * Created by mher.vahramyan on 11/6/2018.
 */
public interface UserService {
    void addUser(User user);

    void removeUser(User user);

    User getUser(String username);
}
