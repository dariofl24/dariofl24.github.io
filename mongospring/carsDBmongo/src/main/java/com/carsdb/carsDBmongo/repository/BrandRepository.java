package com.carsdb.carsDBmongo.repository;

import java.util.Optional;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.carsdb.carsDBmongo.entity.Brand;

public interface BrandRepository extends MongoRepository<Brand,String> {
	
	Optional<Brand> getById(String id);
	
	Optional<Brand> getByName(String name);
	
	Optional<Brand> getByCode(String code);

}
