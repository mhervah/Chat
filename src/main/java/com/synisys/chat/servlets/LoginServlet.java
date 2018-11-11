package com.synisys.chat.servlets;

import com.google.gson.Gson;
import com.synisys.chat.models.User;

import javax.servlet.ServletException;
import javax.servlet.http.*;
import java.io.IOException;
import java.io.PrintWriter;
import java.lang.reflect.Type;
import java.util.ArrayList;

import static com.synisys.chat.services.UserServiceImp.userService;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        HttpSession session = req.getSession();
        String registerName = session.getAttribute("username").toString();
        session.setAttribute("username", registerName);
        String gsonUser = new Gson().toJson(registerName);
        PrintWriter writer = resp.getWriter();
        writer.write(gsonUser);
        writer.close();
    }

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {

        User user1 = new Gson().fromJson(req.getReader(), User.class);
        HttpSession session = req.getSession();
        String username = user1.getUsername();
        session.setAttribute("username", username);

        User user = userService.getUser(username);
        setAdminCookie(user,resp);

        if (user == null || !user1.getPassword().equals(user.getPassword())) {
            resp.setHeader("valid", "password or username don't correct");
        } else {
            resp.getWriter().append("profile.html");
        }
    }

    private void setAdminCookie(User user, HttpServletResponse resp) {
        Cookie adminCk;
        if (userService.isAdmin(user)) {
            adminCk = new Cookie("admin", "yes");
        } else {
            adminCk = new Cookie("admin", "no");
        }
        resp.addCookie(adminCk);
    }
}
