package com.carsdb.carsDBmongo.service;

import java.util.List;
import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Brand;

public interface BrandService {
	
	Optional<Brand> getByName(String name);
	
	Optional<Brand> getByCode(String code);
	
	List<Brand> findAll();
	
	void deleteAll();
	
	Brand create(Brand brand);
	
	Brand update(Brand brand);

}
