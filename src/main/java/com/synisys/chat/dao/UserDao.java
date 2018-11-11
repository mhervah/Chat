package com.synisys.chat.dao;

import com.synisys.chat.constants.Constants;
import com.synisys.chat.exceptions.UserNotFoundException;
import com.synisys.chat.models.User;

import java.util.*;

public class UserDao {
    private HashMap<String, User> users;

    public void addUser(User user) {
        users.put(user.getUsername(), user);
    }

    public void removeUser(User user) {
        users.remove(user.getUsername());
    }

    public User getUser(String username) {
        return users.get(username);
    }

    public HashMap<String, User> getUsers() {
        return users;
    }

    {
        users = new HashMap<>();
        users.put("Mher",new User("Mher", "pass", Constants.ADMIN_ID));
    }


}
