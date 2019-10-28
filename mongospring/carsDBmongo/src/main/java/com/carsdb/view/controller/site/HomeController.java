package com.carsdb.view.controller.site;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.carsDBmongo.service.CarModelInfoService;

@Controller
public class HomeController {
	
	@Autowired
	private CarModelInfoService carModelInfoService;
	
	@Autowired
	private BrandService brandService;

	private static final String HOME_TEMPLATE = "homeTemplate";

	@RequestMapping(value = "/", method = RequestMethod.GET)
	public String landing(final Map<String, Object> model) {
		
		dispatch(model);
		
		return HOME_TEMPLATE;
	}

	@RequestMapping(value = "/home", method = RequestMethod.GET)
	public String home(final Map<String, Object> model) {
		
		dispatch(model);
		
		return HOME_TEMPLATE;
	}

	protected void dispatch(final Map<String, Object> model) {
		
		final List<CarModelInfo> featured =carModelInfoService.getLatest10Added().orElse(new ArrayList<CarModelInfo>());
		
		System.out.println(featured.size());
		
		model.put("featured",featured);
	}

}
