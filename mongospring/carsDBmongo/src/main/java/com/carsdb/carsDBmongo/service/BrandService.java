package com.carsdb.carsDBmongo.service;

import java.util.List;
import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Brand;

public interface BrandService {
	
	Optional<Brand> getByName(String name);
	
	Optional<Brand> getByCode(String code);
	
	List<Brand> findAll();
	
	void deleteAll();
	
	Optional<Brand> save(Brand brand);
	
	Optional<Brand> upsert(Brand brand);
	
	Optional<Brand> update(Brand brand);

}
