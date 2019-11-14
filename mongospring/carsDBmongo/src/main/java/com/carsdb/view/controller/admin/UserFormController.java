package com.carsdb.view.controller.admin;

import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.facade.UserFacade;
import com.carsdb.view.abs.AbstractViewController;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping(value = "/admin")
public class UserFormController extends AbstractViewController
{
    @Autowired
    private UserFacade userFacade;

    @GetMapping("/formuser")
    public String getUser(final Map<String, Object> model,
            @RequestParam(value = "code", required = false) final String code, final HttpServletResponse response)
    {
        setResponseCacheHeaders(response);

        if (StringUtils.isNotEmpty(code))
        {
            final Optional<UserDto> byUsername = userFacade.getByUsername(code);

            if (byUsername.isPresent())
            {
                model.put("founduser", parse2Json(byUsername.get()));
            }
            else
            {
                response.setStatus(HttpStatus.SC_NOT_FOUND);
                return NOT_FOUND_PAGE;
            }

            model.put("usercode", code);
        }

        return "userform";
    }
}
