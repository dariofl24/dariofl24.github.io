package com.carsdb.view.abs;

import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.security.facade.UserFacade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;

public class AbstractViewController
{
    private static final Logger LOG = LoggerFactory.getLogger(AbstractViewController.class);

    @Autowired
    private UserFacade userFacade;

    protected void setResponseCacheHeaders(final HttpServletResponse response)
    {
        response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
        response.setHeader("Pragma", "no-cache");
        response.setDateHeader("Expires", 0);
    }

    protected void setUserInfo(final Map<String, Object> model)
    {
        try
        {
            Optional.ofNullable(userFacade.getAuthentication())
                    .map(Authentication::getName)
                    .ifPresent(name -> model.put("userName", name));
        }
        catch (final Exception ex)
        {
            LOG.error("There was an error while retrieving user name.", ex);
        }
    }
}
