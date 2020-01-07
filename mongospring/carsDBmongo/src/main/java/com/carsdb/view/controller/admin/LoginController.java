package com.carsdb.view.controller.admin;

import com.carsdb.view.abs.AbstractViewController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
public class LoginController extends AbstractViewController
{
    @RequestMapping(value = "/login", method = RequestMethod.GET)
    public String getLogin()
    {
        return "login";
    }
}
