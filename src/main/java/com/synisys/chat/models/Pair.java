package com.synisys.chat.models;

import com.synisys.chat.exceptions.UserNotFoundException;

/**
 * Created by mher.vahramyan on 11/5/2018.
 */
public class Pair {
    private User user1;
    private User user2;

    public Pair(User user1,User user2){
        this.user1 = user1;
        this.user2 = user2;
    }
    @Override
    public boolean equals(Object obj) {
        // If the object is compared with itself then return true
        if (obj == this) {
            return true;
        }

        /* Check if obj is an instance of User or not
          "null instanceof [type]" also returns false */
        if (!(obj instanceof Pair)) {
            return false;
        }

        // typecast obj to User so that we can compare data members
        Pair pair = (Pair) obj;

        // Compare the data members and return accordingly
        return (this.getUser1().equals(pair.getUser1())&&this.getUser2().equals(pair.getUser2()))||
                (this.getUser1().equals(pair.getUser2())&&this.getUser2().equals(pair.getUser1()));
    }

    public User getUser2() {
        return user2;
    }


    public User getUser1() {
        return user1;
    }

    public boolean isUserInPair(String name){
        return user1.getUsername().equals(name) || user2.getUsername().equals(name);
    }

    public String interceptUser(String username) {
        if(isUserInPair(username)){
            if (user2.getUsername().equals(username)) {
                return user1.getUsername();
            }
            return user2.getUsername();
        }
        throw new UserNotFoundException();
    }

    @Override
    public int hashCode() {
        return user1.hashCode()+user2.hashCode();
    }
}
