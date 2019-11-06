package com.carsdb.rest.controller;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.carsdb.carsDBmongo.dto.CarModelInfoDto;
import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/carmodel", produces = "application/json")
public class CarModelController
{
    @Autowired
    private CarModelInfoService carModelInfoService;

    @Autowired
    @Qualifier("defaultMapper")
    private MapperFacade mapperFacade;

    @PostMapping("/upsert")
    public ResponseEntity<CarModelInfoDto> upsert(@RequestBody final CarModelInfoDto carModelInfoDto)
    {

        final CarModelInfo entity = mapperFacade.map(carModelInfoDto, CarModelInfo.class);

        final Optional<CarModelInfo> saved = carModelInfoService.upsert(entity);

        System.out.println(">>> upsert:: " + saved.get());

        if (saved.isPresent())
        {
            return new ResponseEntity<>(mapperFacade.map(saved.get(), CarModelInfoDto.class),
                    HttpStatus.CREATED);
        }
        else
        {
            return new ResponseEntity<>(new CarModelInfoDto(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<CarModelInfoDto> create(@RequestBody final CarModelInfoDto carModelInfoDto)
    {

        carModelInfoDto.setId(null);

        final CarModelInfo entity = mapperFacade.map(carModelInfoDto, CarModelInfo.class);

        final Optional<CarModelInfo> saved = carModelInfoService.create(entity);

        if (saved.isPresent())
        {
            return new ResponseEntity<>(mapperFacade.map(saved.get(), CarModelInfoDto.class),
                    HttpStatus.CREATED);
        }
        else
        {
            return new ResponseEntity<>(new CarModelInfoDto(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping
    public ResponseEntity<String> update(@RequestBody CarModelInfoDto carModelInfoDto)
    {

        CarModelInfo entity = mapperFacade.map(carModelInfoDto, CarModelInfo.class);

        carModelInfoService.update(entity);

        return new ResponseEntity<>("Updated !", HttpStatus.OK);
    }

    @GetMapping
    public List<CarModelInfoDto> getAllCarModelInfoByPage(
            @RequestParam(value = "p", required = false, defaultValue = "0") String page,
            @RequestParam(value = "sz", required = false, defaultValue = "25") String size)
    {

        int _page = 0;
        int _size = 25;

        if (page != null && size != null)
        {
            _page = Integer.parseInt(page);
            _size = Integer.parseInt(size);
        }

        List<CarModelInfo> list = carModelInfoService.findAll(_page, _size);

        List<CarModelInfoDto> listDto = list.stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class))
                .collect(Collectors.toList());

        return listDto;
    }

    @GetMapping("/latest")
    public List<CarModelInfoDto> getLatest()
    {

        List<CarModelInfoDto> list = carModelInfoService.getLatest10Added().orElseThrow(() -> new RuntimeException(""))
                .stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

        return list;
    }

    @GetMapping("/{id}/id")
    public CarModelInfoDto getCarModelInfoById(@PathVariable String id)
    {

        CarModelInfo carModelInfo = carModelInfoService.getById(id).orElseThrow(() -> new RuntimeException(""));

        return mapperFacade.map(carModelInfo, CarModelInfoDto.class);
    }

    @GetMapping("/{year}/year")
    public List<CarModelInfoDto> getByYear(@PathVariable int year)
    {

        List<CarModelInfoDto> list = carModelInfoService.findByYear(year).orElseThrow(() -> new RuntimeException(""))
                .stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

        return list;
    }

    @GetMapping("/{name}/name")
    public List<CarModelInfoDto> getByName(@PathVariable String name)
    {

        List<CarModelInfoDto> list = carModelInfoService.findByName(name).orElseThrow(() -> new RuntimeException(""))
                .stream().map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

        return list;
    }

    @GetMapping("/{manufacturer}/manufacturer")
    public List<CarModelInfoDto> getByManufacturer(@PathVariable String manufacturer)
    {

        List<CarModelInfoDto> list = carModelInfoService.findByManufacturer(manufacturer)
                .orElseThrow(() -> new RuntimeException("")).stream()
                .map(c -> mapperFacade.map(c, CarModelInfoDto.class)).collect(Collectors.toList());

        return list;
    }
}
