package com.synisys.chat.servlets;

import com.google.gson.Gson;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.Map;

import static com.synisys.chat.services.ChatServiceImp.chatService;

/**
 * Created by mery.manukyan on 11/8/2018.
 */
public class StateMessage extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username1 = req.getSession().getAttribute("username").toString();
        Map<String, Integer> stringIntegerMap = chatService.listNotReadedMessageForSender(username1);
        Gson gson = new Gson();
        PrintWriter writer = resp.getWriter();
        writer.print(gson.toJson(stringIntegerMap));
        writer.close();
        writer.flush();
    }
}
