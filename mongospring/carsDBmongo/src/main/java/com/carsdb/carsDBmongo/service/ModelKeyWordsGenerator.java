package com.carsdb.carsDBmongo.service;

import java.util.List;

import com.carsdb.carsDBmongo.entity.CarModelInfo;

public interface ModelKeyWordsGenerator
{
    List<String> generateKeyWords(CarModelInfo modelInfo);
}
