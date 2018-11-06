package com.synisys.chat.models;

import com.synisys.chat.models.User;

import java.io.Serializable;
import java.util.Date;

public class Message implements Serializable{
    private int id;
    private static int counter = 0;
    private String text;
    private String sender;
    private String reciever;
    private Date date;
    private boolean edited;
    public Message(){
        this.id = counter++;
    }

    public Message(String text, String sender, String reciever, Date date){
        this.text = text;
        this.sender = sender;
        this.reciever = reciever;
        this.reciever = reciever;
        this.date = date;
        this.id = counter++;
    }

    public int getId() {
        return id;
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

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }

    public void setSender(String sender) {
        this.sender = sender;
    }

    public void setText(String text) {
        this.text = text;
    }


}
