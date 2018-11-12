package com.synisys.chat.servlets;


import com.synisys.chat.models.User;

import javax.servlet.RequestDispatcher;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.synisys.chat.services.UserServiceImp.userService;

public class RegisterServlet extends HttpServlet {
    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException, ServletException {
        String username = req.getParameter("username");
        String password = req.getParameter("password");
        String confirmPassword = req.getParameter("confirmPassword");
        if (userService.getUser(username) != null) {
            resp.setHeader("username", "username is already in use");
        } else {
            if (password.isEmpty() || !password.equals(confirmPassword)) {
                resp.setHeader("username", "password don't match");
            } else {
                userService.addUser(new User(username, password));
            }
        }
    }
}
