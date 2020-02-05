package com.carsdb.view.controller.admin;

import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.view.abs.AbstractViewController;
import org.apache.commons.lang3.StringUtils;
import org.apache.http.HttpStatus;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
@RequestMapping(value = "/admin/formmanufacturer")
public class ManufacturerFormController extends AbstractViewController
{
    @Autowired
    private BrandService brandService;

    @GetMapping
    public String getFormManufacturer(final Map<String, Object> model,
            @RequestParam(value = "code", required = false) final String code, final HttpServletResponse response)
    {
        setResponseCacheHeaders(response);

        if (StringUtils.isNotEmpty(code))
        {
            final Optional<Brand> foundManuf = brandService.getByCode(code);

            if (foundManuf.isPresent())
            {
                model.put("foundmanufacturer", parse2Json(foundManuf.get()));
            }
            else
            {
                response.setStatus(HttpStatus.SC_NOT_FOUND);
                return NOT_FOUND_PAGE;
            }
        }

        return "formmanufacturer";
    }
}
