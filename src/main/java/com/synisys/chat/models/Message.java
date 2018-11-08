package com.synisys.chat.models;

import com.synisys.chat.models.User;

import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

public class Message implements Serializable {
    private int id;
    private static int counter = 0;
    private String text;
    private String sender;
    private String reciever;
    private long date;
    private boolean edited;
    private boolean deleted;

    public Message() {
        this.id = counter++;
    }

    public Message(String text, String sender, String reciever, long date) {
        this.text = text;
        this.sender = sender;
        this.reciever = reciever;
        this.reciever = reciever;
        this.date = date;
        this.id = counter++;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public int getId() {
        return id;
    }

    public boolean isEdited() {
        return edited;
    }

    public void setEdited(boolean edited) {
        this.edited = edited;
    }

    public String getReciever() {
        return reciever;
    }

    public String getText() {
        return text;
    }

    public String getSender() {
        return sender;
    }

    public long getDate() {
        return date;
    }

    public void setDate(long time) {
        this.date = time;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setText(String text) {
        this.text = text;
    }


}
