package com.synisys.chat.servlets;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.synisys.chat.dao.ChatDao;
import com.synisys.chat.models.Message;
import com.synisys.chat.models.Pair;
import com.synisys.chat.models.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.List;

import static com.synisys.chat.services.ChatServiceImp.chatService;
import static com.synisys.chat.services.UserServiceImp.userService;

public class MessageServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        Message message = gson.fromJson(req.getReader(), Message.class);

        String username1 =  message.getSender();
        String username2 = message.getReciever();
        User user1 = userService.getUser(username1);
        User user2 = userService.getUser(username2);
        ChatDao.getChat(new Pair(user1,user2)).add(message);


       // messageService.addMessage(message);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String username1 = req.getParameter("user1");
        String username2 = req.getParameter("user2");
        User user1 = userService.getUser(username1);
        User user2 = userService.getUser(username2);
        Pair pair = new Pair(user1,user2);

        List<Message> chat = ChatDao.getChat(pair);
        if(chat == null)
        {
            chatService.addChat(pair);
            chat = chatService.getChat(pair);
        }

        resp.setContentType("application/json");
        String json = new Gson().toJson(chat, ArrayList.class);
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(json);
        out.flush();
        out.close();
    }

    @Override
    protected void doPut(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
       int id =json.get("id").getAsInt();
        User sender = userService.getUser(json.get("sender").getAsString());
        User reciever = userService.getUser(json.get("reciever").getAsString());
        Pair pair = new Pair(sender,reciever);
        chatService.editMessage(pair,id,json.get("text").getAsString());
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        int id =json.get("id").getAsInt();
        User sender = userService.getUser(json.get("sender").getAsString());
        User reciever = userService.getUser(json.get("reciever").getAsString());
        Pair pair = new Pair(sender,reciever);
        chatService.removeMessage(pair,id);
    }
}
