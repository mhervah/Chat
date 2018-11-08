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
import javax.servlet.http.HttpSession;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

import static com.synisys.chat.services.ChatServiceImp.chatService;
import static com.synisys.chat.services.UserServiceImp.userService;

public class MessageServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        Gson gson = new Gson();
        Message message = gson.fromJson(req.getReader(), Message.class);
        HttpSession session = req.getSession();
        String username1 = session.getAttribute("username").toString();
        message.setSender(username1);
        String username2 = message.getReciever();
        User user1 = userService.getUser(username1);
        User user2 = userService.getUser(username2);
        chatService.getChat(new Pair(user1,user2)).add(message);


       // messageService.addMessage(message);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        HttpSession session = req.getSession();
        String username1 = session.getAttribute("username").toString();
        String username2 = req.getParameter("user2");
        User user1 = userService.getUser(username1);
        User user2 = userService.getUser(username2);
        Pair pair = new Pair(user1,user2);
        Long miliseconds = Long.valueOf(req.getParameter("date"));

        if(chatService.getChat(pair) == null)
        {
            chatService.addChat(pair);
        }

        List<Message> messagesFromDate = chatService.getChatFromDate(pair,miliseconds);
        List<Message> messagesDeleted =  chatService.getDeleted(pair);
        List<Message> messagesEdited = chatService.getEdited(pair);

        List<Message> sentMessageList = new ArrayList<>();
        sentMessageList.addAll(messagesFromDate);
        sentMessageList.addAll(messagesDeleted);
        sentMessageList.addAll(messagesEdited);

        resp.setContentType("application/json");
        String json = new Gson().toJson(sentMessageList, ArrayList.class);
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
        HttpSession session = req.getSession();
        User sender = userService.getUser(session.getAttribute("username").toString());
        User reciever = userService.getUser(json.get("reciever").getAsString());
        Pair pair = new Pair(sender,reciever);
        chatService.editMessage(pair,id,json.get("text").getAsString());
    }

    @Override
    protected void doDelete(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        Gson gson = new Gson();
        JsonObject json = gson.fromJson(req.getReader(), JsonObject.class);
        int id =json.get("id").getAsInt();
        HttpSession session = req.getSession();
        User sender = userService.getUser(session.getAttribute("username").toString());
        User reciever = userService.getUser(json.get("reciever").getAsString());
        Pair pair = new Pair(sender,reciever);
        chatService.removeMessage(pair,id);
    }
}
