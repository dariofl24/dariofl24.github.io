package com.carsdb.view.controller.admin;

import java.util.Map;
import java.util.Optional;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import com.carsdb.carsDBmongo.utils.Properties;
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
public class CarModelInfoFormController extends AbstractViewController
{
    @Autowired
    private CarModelInfoService carModelInfoService;

    @Autowired
    private BrandService brandService;

    @GetMapping("/form")
    public String getForm(final Map<String, Object> model,
            @RequestParam(value = "id", required = false) final String id, final HttpServletRequest request,
            final HttpServletResponse response)
    {
        setResponseCacheHeaders(response);

        if (StringUtils.isNotEmpty(id))
        {
            Optional<CarModelInfo> foundModel = carModelInfoService.getById(id);

            if (foundModel.isPresent())
            {
                model.put("foundModel", parse2Json(foundModel.get()));
            }
            else
            {
                response.setStatus(HttpStatus.SC_NOT_FOUND);
                return NOT_FOUND_PAGE;
            }
        }

        model.put("allBrands", brandService.findAll());
        model.put("transmissionTypes", Properties.TRANSMISSION_TYPE_LIST);
        model.put("tractionTypes", Properties.TRACTION_TYPE_LIST);
        model.put("engineTypes", Properties.ENGINE_TYPE_LIST);
        model.put("carTypes", Properties.CAR_TYPE_LIST);
        model.put("powerTrainTypes", Properties.POWER_TRAIN_TYPE_LIST);
        model.put("documentStates", Properties.DOCUMENT_STATE_TYPE_LIST);

        return "form";
    }
}
