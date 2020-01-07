package com.carsdb.carsDBmongo.service;

import com.carsdb.carsDBmongo.entity.CarModelInfo;

public interface ModelIdentityGenerator
{
    String getModelId(CarModelInfo model);
}
