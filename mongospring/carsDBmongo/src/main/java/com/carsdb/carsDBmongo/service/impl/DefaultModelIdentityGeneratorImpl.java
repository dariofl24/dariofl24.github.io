package com.carsdb.carsDBmongo.service.impl;

import java.util.Optional;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.service.ModelIdentityGenerator;
import org.springframework.stereotype.Service;

@Service
public class DefaultModelIdentityGeneratorImpl implements ModelIdentityGenerator
{
    @Override
    public String getModelId(final CarModelInfo model)
    {
        final StringBuilder sb = new StringBuilder();

        sb.append(Optional.ofNullable(model.getManufacturer()).orElse("").replace(" ", "_").toLowerCase());
        sb.append(Optional.ofNullable(model.getName()).orElse("").replace(" ", "_").toLowerCase());
        sb.append(Optional.ofNullable(model.getYear() + "").orElse("").replace(" ", "_").toLowerCase());
        sb.append(Optional.ofNullable(model.getGeneration() + "").orElse("").replace(" ", "_").toLowerCase());

        return sb.toString();
    }
}
