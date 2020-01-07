package com.carsdb.carsDBmongo.service.impl;

import java.util.Optional;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.ModelIdentityGenerator;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class DefaultModelIdentityGeneratorImpl implements ModelIdentityGenerator
{
    @Override
    public String getModelId(final CarModelInfo model)
    {
        final StringBuilder sb = new StringBuilder();

        sb.append(Optional.ofNullable(model.getManufacturer()).orElse(StringUtils.EMPTY).replace(StringUtils.SPACE, "_").toLowerCase());
        sb.append(Optional.ofNullable(model.getName()).orElse(StringUtils.EMPTY).replace(StringUtils.SPACE, "_").toLowerCase());
        sb.append(Optional.ofNullable(model.getYear() + StringUtils.EMPTY).orElse(StringUtils.EMPTY).replace(StringUtils.SPACE, "_").toLowerCase());
        sb.append(Optional.ofNullable(model.getGeneration() + StringUtils.EMPTY).orElse(StringUtils.EMPTY).replace(StringUtils.SPACE, "_").toLowerCase());

        return sb.toString();
    }
}
