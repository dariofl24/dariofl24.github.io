package com.carsdb.carsDBmongo.service;

import java.util.List;
import java.util.Optional;

import com.carsdb.carsDBmongo.entity.CarModelInfo;

public interface CarModelInfoService {
	
	void create(CarModelInfo model);
	
	void update(CarModelInfo model);
	
	void deleteAll();
	
	List<CarModelInfo> findAll(int page,int size);
	
	Optional<CarModelInfo> getById(String id);
	
	Optional<List<CarModelInfo>> findByName(String name);
	
	Optional<List<CarModelInfo>> findByManufacturer(String manufacturer);
	
	Optional<List<CarModelInfo>> findByYear(int year);
	
	Optional<List<CarModelInfo>> getLatestAdded();

}
