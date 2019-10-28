package com.carsdb.view.controller.site;

import java.util.Map;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.view.abs.AbstractDocumentController;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/model")
public class DocumentViewController extends AbstractDocumentController
{
    @GetMapping
    public String defaultModelPage()
    {
        return NOT_FOUND;
    }

    @GetMapping(value = "/{id}")
    public String modelPagePublish(final Map<String, Object> model, @PathVariable final String id,
            final HttpServletResponse response)
    {
        return this.dispatch(model, id, response, false);
    }
}
