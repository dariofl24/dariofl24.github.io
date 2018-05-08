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
import com.carsdb.carsDBmongo.entity.DocumentState;
import com.carsdb.carsDBmongo.repository.BrandRepository;
import com.carsdb.carsDBmongo.repository.CarModelInfoRepository;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import com.carsdb.exception.CarModelInfoException;

@Service
public class CarModelInfoServiceImpl implements CarModelInfoService {

	@Autowired
	private CarModelInfoRepository carModelInfoRepository;

	@Autowired
	private BrandRepository brandRepository;
	
	@Override
	public Optional<CarModelInfo> upsert(CarModelInfo model) {
		
		if( isNewModel(model) ){
			
			model.setDateAdded(new Date());
			setModelId(model);
			
		}else{
			model.setLastEdited(new Date());
		}
		
		if (!validateManufacturer(model)) {
			throw new CarModelInfoException("INVALID MANUFACTURER");
		}
		
		CarModelInfo saved = carModelInfoRepository.save(model);
		return Optional.ofNullable(saved);
	}
	
	private boolean isNewModel(CarModelInfo model){
		
		if(!StringUtils.isEmpty(model.getId()) ){
			
			Optional<CarModelInfo> carModelOpt = carModelInfoRepository.getById(model.getId());
			
			return !carModelOpt.isPresent();
			
		}
		
		return true;
	}

	@Override
	public Optional<CarModelInfo> create(CarModelInfo model) {

		if(!StringUtils.isEmpty(model.getId()) ){
			
			Optional<CarModelInfo> carModelOpt = carModelInfoRepository.getById(model.getId());

			if (!carModelOpt.isPresent()) {
				throw new CarModelInfoException("MODEL WITH ID NOT FOUND");
			}
			
		}

		if (!validateManufacturer(model)) {
			throw new CarModelInfoException("INVALID MANUFACTURER");
		}

		model.setDateAdded(new Date());
		this.setModelId(model);

		CarModelInfo saved = carModelInfoRepository.save(model);
		return Optional.ofNullable(saved);
	}

	private void setModelId(final CarModelInfo model) {
		
		final StringBuilder sb = new StringBuilder();

		sb.append(Optional.ofNullable(model.getManufacturer()).orElse("").replace(" ", "_").toLowerCase());
		sb.append(Optional.ofNullable(model.getName()).orElse("").replace(" ", "_").toLowerCase());
		sb.append(Optional.ofNullable(model.getYear() + "").orElse("").replace(" ", "_").toLowerCase());
		sb.append(Optional.ofNullable(model.getGeneration() + "").orElse("").replace(" ", "_").toLowerCase());

		model.setId(sb.toString());
	}

	@Override
	public void update(CarModelInfo model) {

		if (StringUtils.isEmpty(model.getId())) {
			throw new CarModelInfoException("");
		}

		Optional<CarModelInfo> carModelOpt = carModelInfoRepository.getById(model.getId());

		if (!carModelOpt.isPresent()) {
			throw new CarModelInfoException("");
		}

		if (!validateManufacturer(model)) {
			throw new CarModelInfoException("");
		}

		model.setLastEdited(new Date());
		carModelInfoRepository.save(model);

	}

	private boolean validateManufacturer(CarModelInfo model) {

		Optional<Brand> brand = brandRepository.getByCode(model.getManufacturer());

		return brand.isPresent();
	}

	@Override
	public void deleteAll() {
		carModelInfoRepository.deleteAll();
	}

	@Override
	public List<CarModelInfo> findAll(int page, int size) {

		Pageable pageableRequest = new PageRequest(page, size);

		Page<CarModelInfo> pageResult = carModelInfoRepository.findAllByOrderByDateAddedDesc(pageableRequest);

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
	public Optional<List<CarModelInfo>> getLatest10Added() {
		return carModelInfoRepository.findFirst10ByDocumentStateAndFeaturedOrderByDateAddedDesc(DocumentState.Publish, true);
	}

}
