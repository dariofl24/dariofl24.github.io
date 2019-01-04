package com.carsdb.view.controller;

import java.util.Map;
import java.util.Optional;

import javax.servlet.http.HttpServletResponse;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.apache.http.HttpStatus;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import com.carsdb.carsDBmongo.utils.Properties;
import com.carsdb.exception.CarModelInfoException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

@Controller
@RequestMapping(value = "/admin")
public class FormController {
	
	@Autowired
	private CarModelInfoService carModelInfoService;
	
	@Autowired
	private BrandService brandService;
	
	@RequestMapping(value="/form", method = RequestMethod.GET)
	public String getForm(final Map<String, Object> model,@RequestParam(value="id",required=false) final String id,
			final HttpServletResponse response) {
		
		if(StringUtils.isNotEmpty(id)){
		
			Optional<CarModelInfo> foundModel =carModelInfoService.getById(id);
			
			if(foundModel.isPresent()){
				
				model.put("foundModel",parse2Json( foundModel.get() ));
				
			}else{
				response.setStatus(HttpStatus.SC_NOT_FOUND);
				return "P404";
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
	
	private String parse2Json(CarModelInfo entity){
		
		ObjectMapper mapper = new ObjectMapper();
		
		try {
			return mapper.writeValueAsString(entity);
		} catch (JsonProcessingException e) {
			e.printStackTrace();
			throw new CarModelInfoException("An error ocurred while parsing to JSON",e);
		}
		
	}

	
	
	
	
	
	
	
	
	
	
	
	
}