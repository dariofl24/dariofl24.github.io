package com.carsdb.view.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.CarModelInfoService;

@Controller
@RequestMapping(value = "/admin")
public class ListController {
	
	@Autowired
	private CarModelInfoService carModelInfoService;
	
	@RequestMapping(value = "/list", method = RequestMethod.GET)
	public String list(Map<String, Object> model) {
		
		final List<CarModelInfo> allList =carModelInfoService.findAll(0, 25);
		
		model.put("message","This is a message!!!!");
		model.put("allModels",allList);
		  
		return "list";
	}

}
