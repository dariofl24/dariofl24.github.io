package com.carsdb.carsDBmongo.facade;

import java.util.List;

import com.carsdb.carsDBmongo.dto.CarModelInfoDto;

public interface SearchFacade
{
    List<CarModelInfoDto> searchByText(String term);

    List<CarModelInfoDto> searchByText(String term, int size, int page);
}
