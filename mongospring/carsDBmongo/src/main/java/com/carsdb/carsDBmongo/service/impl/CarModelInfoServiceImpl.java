package com.carsdb.carsDBmongo.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.repository.BrandRepository;
import com.carsdb.carsDBmongo.repository.CarModelInfoRepository;
import com.carsdb.carsDBmongo.service.CarModelInfoService;

@Service
public class CarModelInfoServiceImpl implements CarModelInfoService {

	@Autowired
	private CarModelInfoRepository carModelInfoRepository;
	
	@Autowired
	private BrandRepository brandRepository;
	
	@Override
	public void create(CarModelInfo model) {
		
		if(StringUtils.isEmpty(model.getId())){
			throw new RuntimeException("");
		}
		
		Optional<CarModelInfo> carModelOpt =carModelInfoRepository.getById(model.getId());
		
		if(carModelOpt.isPresent()){
			throw new RuntimeException("");
		}
		
		if(!validateManufacturer(model)){
			throw new RuntimeException("");
		}
		
		model.setDateAdded(new Date());
		
		carModelInfoRepository.save(model);
	}

	@Override
	public void update(CarModelInfo model) {
		
		if(StringUtils.isEmpty(model.getId())){
			throw new RuntimeException("");
		}
		
		Optional<CarModelInfo> carModelOpt =carModelInfoRepository.getById(model.getId());
		
		if(!carModelOpt.isPresent()){
			throw new RuntimeException("");
		}
		
		if(!validateManufacturer(model)){
			throw new RuntimeException("");
		}
		
		model.setLastEdited(new Date());
		carModelInfoRepository.save(model);
		
	}
	
	private boolean validateManufacturer(CarModelInfo model){
		
		Optional<Brand> brand =brandRepository.getByCode(model.getManufacturer());
		
		return brand.isPresent();
	}

	@Override
	public void deleteAll() {
		carModelInfoRepository.deleteAll();
	}

	@Override
	public List<CarModelInfo> findAll(int page,int size) {
		
		Pageable pageableRequest = new PageRequest(page,size);
		
		Page<CarModelInfo> pageResult = carModelInfoRepository.findAllOrderByDateAddedDesc(pageableRequest);
		
		return pageResult.getContent();
	}

	@Override
	public Optional<CarModelInfo> getById(String id) {
		
		return carModelInfoRepository.getById(id);
	}

	@Override
	public Optional<List<CarModelInfo>> findByName(String name) {

		return carModelInfoRepository.findByName(name);
	}

	@Override
	public Optional<List<CarModelInfo>> findByManufacturer(String manufacturer) {
		
		return carModelInfoRepository.findByManufacturer(manufacturer);
	}

	@Override
	public Optional<List<CarModelInfo>> findByYear(int year) {
		
		return carModelInfoRepository.findByYear(year);
	}

	@Override
	public Optional<List<CarModelInfo>> getLatestAdded() {
		return carModelInfoRepository.findFirst25ByOrderByDateAddedDesc();
	}
	

}
