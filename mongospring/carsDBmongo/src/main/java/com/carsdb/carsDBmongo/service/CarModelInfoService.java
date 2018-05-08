package com.carsdb.carsDBmongo.service;

import java.util.List;
import java.util.Optional;

import com.carsdb.carsDBmongo.entity.CarModelInfo;

public interface CarModelInfoService {
	
	Optional<CarModelInfo> upsert(CarModelInfo model);
	
	Optional<CarModelInfo> create(CarModelInfo model);
	
	void update(CarModelInfo model);
	
	void deleteAll();
	
	List<CarModelInfo> findAll(int page,int size);
	
	Optional<CarModelInfo> getById(String id);
	
	Optional<List<CarModelInfo>> findByName(String name);
	
	Optional<List<CarModelInfo>> findByManufacturer(String manufacturer);
	
	Optional<List<CarModelInfo>> findByYear(int year);
	
	Optional<List<CarModelInfo>> getLatest10Added();

}
