package com.synisys.chat.services;

import com.synisys.chat.dao.ChatDao;
import com.synisys.chat.dao.UserDao;
import com.synisys.chat.models.Pair;
import com.synisys.chat.models.User;

import java.util.HashMap;

public class UserServiceImp implements com.synisys.chat.interfaces.UserService {
    public static final UserServiceImp userService = new UserServiceImp();
    private UserDao userDao;
    private static final int ADMIN_ID = -1;

    private UserServiceImp() {
        userDao = new UserDao();
    }

    private static int index = 0;

    @Override
    public void addUser(User user) {
        user.setId(index++);
        userDao.addUser(user);

    }

    @Override
    public void removeUser(User user) {
        userDao.removeUser(user);
    }


    @Override
    public User getUser(String username) {
        return userDao.getUser(username);
    }

    public boolean isAdmin(User user) {
        return user.getId() == ADMIN_ID;
    }

    public HashMap<String,User> getUsers(){
        return userDao.getUsers();
    }
}
