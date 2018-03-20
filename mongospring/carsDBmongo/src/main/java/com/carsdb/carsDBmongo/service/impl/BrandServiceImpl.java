package com.carsdb.carsDBmongo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.repository.BrandRepository;
import com.carsdb.carsDBmongo.service.BrandService;

@Service
public class BrandServiceImpl implements BrandService {
	
	@Autowired
	private BrandRepository brandRepository;

	@Override
	public Optional<Brand> getByName(String name) {
		
		return brandRepository.getByName(name);
	}

	@Override
	public Optional<Brand> getByCode(String code) {
		
		return brandRepository.getByCode(code);
	}

	@Override
	public List<Brand> findAll() {
		
		return brandRepository.findAll();
	}

	@Override
	public void deleteAll() {
		brandRepository.deleteAll();
	}

	@Override
	public Optional<Brand> create(Brand brand) {
		
		Brand saved = brandRepository.save(brand);
		
		return Optional.ofNullable(saved); 
	}

	@Override
	public Optional<Brand> update(Brand brand) {
		
		Optional<Brand> optBrand =brandRepository.getById(brand.getId());
		
		if(!optBrand.isPresent()){
			throw new RuntimeException("");
		}
		
		Brand saved = brandRepository.save(brand);
		
		return Optional.ofNullable(saved);
	}
	
	

}
