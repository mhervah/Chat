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
    /*
    public void deleteUsers(ArrayList<String> list){
       for(int i=0;i<list.size();i++){
            removeUser(Integer.parseInt(list.get(i)));
        }

    }
    private void removeUser(int id){
        for (User user:UserDao.users) {
            if(user.getId()==id){
                UserDao.users.remove(user);
                break;
            }
        }
    }
    public boolean checkUser(User loginUser) {
        for (User user : UserDao.users) {
            if (user.getPassword().equals(loginUser.getPassword()) && user.getUsername().equals(loginUser.getUsername())) {
                return true;
            }
        }
        return false;
    }

    public boolean checkUsername(User loginUser) {
        for (User user : UserDao.users) {
            if (user.getUsername().equals(loginUser.getUsername())) {
                return true;
            }
        }
        return false;
    }



    public void addUser(String username, String password) {
        User newUser = new User(username, password,index++);
        UserDao.users.add(newUser);

        for (User user: UserDao.users) {

            Pair pair = new Pair(user,newUser);
            ChatDao.add(pair);

        }
    }

    public User getUser(String username){
        for (User user : UserDao.users) {
            if (user.getUsername().equals(username)) {
                return user;
            }
        }
        return null;
    }*/
}
