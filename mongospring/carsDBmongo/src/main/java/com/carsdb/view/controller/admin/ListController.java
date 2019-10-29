package com.carsdb.view.controller.admin;

import java.util.List;
import java.util.Map;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import com.carsdb.view.abs.AbstractViewController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping(value = "/admin")
public class ListController extends AbstractViewController
{
    @Autowired
    private CarModelInfoService carModelInfoService;

    @Autowired
    private BrandService brandService;

    @RequestMapping(value = "/listmanufacturer", method = RequestMethod.GET)
    public String listManufacturers(final Map<String, Object> model, final HttpServletResponse response)
    {
        setResponseCacheHeaders(response);

        final List<Brand> allManufacturer = brandService.findAll();

        model.put("message", "All manufacturer !!!");
        model.put("allManufacturer", allManufacturer);
        setUserInfo(model);

        return "listManufacturers";
    }

    @RequestMapping(value = "/list", method = RequestMethod.GET)
    public String list(final Map<String, Object> model, final HttpServletResponse response)
    {
        setResponseCacheHeaders(response);

        final List<CarModelInfo> allModels = carModelInfoService.findAll(0, 25);

        model.put("message", "This is a message!!!!");
        model.put("allModels", allModels);
        setUserInfo(model);

        return "list";
    }
}
