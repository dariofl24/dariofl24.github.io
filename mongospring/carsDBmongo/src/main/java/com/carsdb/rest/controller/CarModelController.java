package com.carsdb.rest.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.carsdb.carsDBmongo.dto.CarModelInfoDto;
import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.CarModelInfoService;

import ma.glasnost.orika.MapperFacade;

@RestController
@RequestMapping(value = "/api/carmodel", produces = "application/json")
public class CarModelController {

	@Autowired
	private CarModelInfoService carModelInfoService;

	@Autowired
	private MapperFacade mapperFacade;

	@RequestMapping(value = "/upsert", method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<CarModelInfoDto> upsert(@RequestBody final CarModelInfoDto carModelInfoDto) {
		
		final CarModelInfo entity = mapperFacade.map(carModelInfoDto, CarModelInfo.class);

		Optional<CarModelInfo> saved = carModelInfoService.upsert(entity);
		
		System.out.println(">>> upsert:: " + saved.get());

		if (saved.isPresent()) {
			return new ResponseEntity<CarModelInfoDto>(mapperFacade.map(saved.get(), CarModelInfoDto.class),
					HttpStatus.CREATED);
		} else {
			return new ResponseEntity<CarModelInfoDto>(new CarModelInfoDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@RequestMapping(method = RequestMethod.POST)
	@ResponseBody
	public ResponseEntity<CarModelInfoDto> create(@RequestBody final CarModelInfoDto carModelInfoDto) {

		carModelInfoDto.setId(null);

		final CarModelInfo entity = mapperFacade.map(carModelInfoDto, CarModelInfo.class);

		Optional<CarModelInfo> saved = carModelInfoService.create(entity);

		// final Optional<CarModelInfo> saved = Optional.of(entity);
		System.out.println(">>> Saved:: " + saved.get());

		if (saved.isPresent()) {
			return new ResponseEntity<CarModelInfoDto>(mapperFacade.map(saved.get(), CarModelInfoDto.class),
					HttpStatus.CREATED);
		} else {
			return new ResponseEntity<CarModelInfoDto>(new CarModelInfoDto(), HttpStatus.INTERNAL_SERVER_ERROR);
		}

	}

	@RequestMapping(method = RequestMethod.PUT)
	@ResponseBody
	public ResponseEntity<String> update(@RequestBody CarModelInfoDto carModelInfoDto) {

		CarModelInfo entity = mapperFacade.map(carModelInfoDto, CarModelInfo.class);

		carModelInfoService.update(entity);

		return new ResponseEntity<>("Updated !", HttpStatus.OK);
	}

	@RequestMapping(method = RequestMethod.GET)
	@ResponseBody
	public List<CarModelInfoDto> getAllCarModelInfoByPage(
			@RequestParam(value = "p", required = false, defaultValue = "0") String page,
			@RequestParam(value = "sz", required = false, defaultValue = "25") String size) {

		int _page = 0;
		int _size = 25;

		if (page != null && size != null) {
			_page = Integer.parseInt(page);
			_size = Integer.parseInt(size);
		}

		List<CarModelInfo> list = carModelInfoService.findAll(_page, _size);

		List<CarModelInfoDto> listDto = list.stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class))
				.collect(Collectors.toList());

		return listDto;

	}

	@RequestMapping(value = "/latest", method = RequestMethod.GET)
	@ResponseBody
	public List<CarModelInfoDto> getLatest() {

		List<CarModelInfoDto> list = carModelInfoService.getLatest10Added().orElseThrow(() -> new RuntimeException(""))
				.stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

		return list;
	}

	@RequestMapping(value = "/{id}/id", method = RequestMethod.GET)
	@ResponseBody
	public CarModelInfoDto getCarModelInfoById(@PathVariable String id) {

		CarModelInfo carModelInfo = carModelInfoService.getById(id).orElseThrow(() -> new RuntimeException(""));

		return mapperFacade.map(carModelInfo, CarModelInfoDto.class);
	}

	@RequestMapping(value = "/{year}/year", method = RequestMethod.GET)
	@ResponseBody
	public List<CarModelInfoDto> getByYear(@PathVariable int year) {

		List<CarModelInfoDto> list = carModelInfoService.findByYear(year).orElseThrow(() -> new RuntimeException(""))
				.stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

		return list;
	}

	@RequestMapping(value = "/{name}/name", method = RequestMethod.GET)
	@ResponseBody
	public List<CarModelInfoDto> getByName(@PathVariable String name) {

		List<CarModelInfoDto> list = carModelInfoService.findByName(name).orElseThrow(() -> new RuntimeException(""))
				.stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

		return list;
	}

	@RequestMapping(value = "/{manufacturer}/manufacturer", method = RequestMethod.GET)
	@ResponseBody
	public List<CarModelInfoDto> getByManufacturer(@PathVariable String manufacturer) {

		List<CarModelInfoDto> list = carModelInfoService.findByManufacturer(manufacturer)
				.orElseThrow(() -> new RuntimeException("")).stream()
				.map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

		return list;
	}

}
