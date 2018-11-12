package com.synisys.chat.models;

import java.io.Serializable;
import java.util.Date;

public class Message implements Serializable {
    private int id;
    private static int counter = 0;
    private String text;
    private String sender;
    private String receiver;
    private long date;
    private boolean edited;
    private boolean deleted;
    private boolean isRead;

    public Message() {
        this.id = counter++;
    }

    public Message(String text, String sender, String receiver, long date) {
        this.text = text;
        this.sender = sender;
        this.receiver = receiver;
        this.receiver = receiver;
        this.date = date;
        this.id = counter++;
    }

    public Message(int id, String text, String receiver) {
        this.id = id;
        this.text = text;
        this.receiver = receiver;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void setReceiver(String receiver) {
        this.receiver = receiver;
    }

    public boolean isDeleted()
    {
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

    public String getReceiver() {
        return receiver;
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

    public void setRead() {
        isRead = true;
    }

    public boolean getIsRead() {
        return isRead;
    }

    public boolean isSender(String username) {
        return this.sender.equals(username);
    }
}
