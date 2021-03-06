package com.carsdb.view.controller.admin;

import java.util.Map;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.view.abs.AbstractDocumentController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/preview")
public class DocumentPreviewController extends AbstractDocumentController
{
    @GetMapping
    public String defaultModelPage()
    {
        return NOT_FOUND;
    }

    @GetMapping("/{id}")
    public String modelPageAdmin(final Map<String, Object> model, @PathVariable final String id,
            final HttpServletResponse response)
    {
        return dispatch(model, id, response, true);
    }
}
