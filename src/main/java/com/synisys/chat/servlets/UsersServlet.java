package com.synisys.chat.servlets;

import com.google.gson.Gson;
import com.synisys.chat.dao.UserDao;
import com.synisys.chat.interfaces.UserService;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

import static com.synisys.chat.services.UserServiceImp.userService;

/**
 * Created by mher.vahramyan on 10/8/2018.
 */
public class UsersServlet extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        resp.setContentType("application/json");
        String json = new Gson().toJson(userService.getUsers());
        PrintWriter out = resp.getWriter();
        resp.setCharacterEncoding("UTF-8");
        out.print(json);
        out.flush();
    }

}
