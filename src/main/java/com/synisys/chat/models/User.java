package com.synisys.chat.models;

import java.util.ArrayList;

public class User {

    private int id;
    private String username;

    private transient String password;

    public User(String username, String password) {
        this.password = password;
        this.username = username;
    }
    public User(String username, String password, int id) {
        this.id = id;
        this.password = password;
        this.username = username;
    }

    @Override
    public boolean equals(Object obj) {
        // If the object is compared with itself then return true
        if (obj == this) {
            return true;
        }

        /* Check if obj is an instance of User or not
          "null instanceof [type]" also returns false */
        if (!(obj instanceof User)) {
            return false;
        }

        // typecast obj to User so that we can compare data members
        User user = (User) obj;

        // Compare the data members and return accordingly
        return this.getId()==user.getId();
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUsername(String username) {
        this.username = username;
    }


}
