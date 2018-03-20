package com.carsdb.rest.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.carsdb.carsDBmongo.dto.BrandDto;
import com.carsdb.carsDBmongo.dto.CarModelInfoDto;
import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.service.BrandService;

import ma.glasnost.orika.MapperFacade;

@RestController
@RequestMapping(value = "/api/brand", produces = "application/json")
public class BrandController {
	
	@Autowired
	private MapperFacade mapperFacade;
	
	@Autowired
	private BrandService brandService;
	
	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<BrandDto> create(@RequestBody BrandDto brandDto){
		
		brandDto.setId(null);
		
		Brand entity = mapperFacade.map(brandDto, Brand.class);
		
		Optional<Brand> saved =  brandService.create(entity);
		
		if(saved.isPresent()){
			
			return new ResponseEntity<BrandDto>(mapperFacade.map(saved.get(),BrandDto.class) ,HttpStatus.CREATED);
			
		}else{
			return new ResponseEntity<BrandDto>(new BrandDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
	}
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	

}
