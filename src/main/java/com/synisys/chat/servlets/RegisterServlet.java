package com.synisys.chat.servlets;


import com.synisys.chat.models.User;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.synisys.chat.services.UserServiceImp.userService;

public class RegisterServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws ServletException, IOException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        boolean isValid = true;
        if (username.isEmpty() || userService.getUser(username) != null) {
            resp.setHeader("username", "not valid");
            isValid = false;
        }
        if (password.isEmpty()) {
            resp.setHeader("password", "not valid");
            isValid = false;
        }
        if (isValid) {
            userService.addUser(new User(username,password));
            resp.sendRedirect("/loginpage.html");
        }

    }
}
