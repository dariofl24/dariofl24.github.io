package com.carsdb.carsDBmongo.service.impl;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.ModelKeyWordsGenerator;
import com.google.common.collect.Lists;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ModelKeyWordsGeneratorImpl implements ModelKeyWordsGenerator
{
    @Override
    public List<String> generateKeyWords(final CarModelInfo modelInfo)
    {
        final List<String> keywords = Lists.newArrayList();

        Optional.of(modelInfo.getManufacturer())
                .map(String::toLowerCase)
                .map(str -> str.split(StringUtils.SPACE))
                .map(Arrays::asList)
                .ifPresent(keywords::addAll);
        Optional.of(modelInfo.getName())
                .map(String::toLowerCase)
                .map(str -> str.split(StringUtils.SPACE))
                .map(Arrays::asList)
                .ifPresent(keywords::addAll);
        Optional.of(modelInfo.getGeneration()).map(Object::toString).ifPresent(keywords::add);
        Optional.of(modelInfo.getYear()).map(Object::toString).ifPresent(keywords::add);

        return keywords;
    }
}
