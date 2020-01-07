package com.carsdb.rest.controller;

import java.util.List;

import com.carsdb.carsDBmongo.dto.CarModelInfoDto;
import com.carsdb.carsDBmongo.facade.SearchFacade;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/search", produces = "application/json")
public class SearchController
{
    @Autowired
    private SearchFacade searchFacade;

    @GetMapping
    public ResponseEntity<List<CarModelInfoDto>> searchByTerm(
            @RequestParam(value = "q") final String term)
    {
        final List<CarModelInfoDto> carModelInfos = searchFacade.searchByText(term);

        if (CollectionUtils.isNotEmpty(carModelInfos))
        {
            return new ResponseEntity<>(carModelInfos, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }
}
