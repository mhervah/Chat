package com.synisys.chat.servlets;


import com.synisys.chat.models.User;

import javax.servlet.ServletException;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.synisys.chat.services.UserServiceImp.userService;

public class LoginServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");


        Cookie adminCk;
        User user = userService.getUser(username);
        if (userService.isAdmin(user)) {
            adminCk = new Cookie("admin", "yes");
        } else {
            adminCk = new Cookie("admin", "no");
        }


        resp.addCookie(adminCk);
        if (user != null && password.equals(user.getPassword())) {
            Cookie usernameCookie = new Cookie("username", username);
            resp.addCookie(usernameCookie);
            resp.sendRedirect("profile.html");
        } else {
            resp.sendRedirect("registerpage.html");
        }


    }

}
