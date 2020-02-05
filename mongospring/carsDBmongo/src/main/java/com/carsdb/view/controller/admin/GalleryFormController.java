package com.carsdb.view.controller.admin;

import java.util.Map;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.carsDBmongo.facade.GalleryFacade;
import com.carsdb.view.abs.AbstractViewController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping(value = "/admin/formgallery")
public class GalleryFormController extends AbstractViewController
{
    @Autowired
    private GalleryFacade galleryFacade;

    @GetMapping
    public String getForm(final Map<String, Object> model,
            @RequestParam(value = "code", required = false) final String code, final HttpServletResponse response)
    {
        setResponseCacheHeaders(response);

        return "formgallery";
    }
}
