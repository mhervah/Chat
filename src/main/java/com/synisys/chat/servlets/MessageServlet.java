package com.synisys.chat.servlets;

import com.google.gson.Gson;
import com.synisys.chat.dao.ChatDao;
import com.synisys.chat.models.Chat;
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

import static com.synisys.chat.dao.ChatDao.chats;

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
        Chat chat = ChatDao.getChat(new Pair(user1,user2));
        chat.addMessage(message);

       // messageService.addMessage(message);
    }

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        String username1 = req.getParameter("user1");
        String username2 = req.getParameter("user2");
        User user1 = userService.getUser(username1);
        User user2 = userService.getUser(username2);
        Pair pair = new Pair(user1,user2);
        Chat chat = ChatDao.getChat(pair);
        if(chat == null)
        {
            ChatDao.addChat(pair);
            chat = ChatDao.getChat(pair);
        }

        resp.setContentType("application/json");
        String json = new Gson().toJson(chat.getMessagelist(), ArrayList.class);
        resp.setCharacterEncoding("UTF-8");
        PrintWriter out = resp.getWriter();
        out.print(json);
        out.flush();
        out.close();
    }
}
