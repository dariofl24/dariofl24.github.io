package com.carsdb.carsDBmongo.service.impl;

import java.util.List;
import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.repository.BrandRepository;
import com.carsdb.carsDBmongo.service.BrandService;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class BrandServiceImpl implements BrandService
{
    @Autowired
    private BrandRepository brandRepository;

    @Override
    public Optional<Brand> getByName(final String name)
    {
        return brandRepository.getByName(name);
    }

    @Override
    public Optional<Brand> getByCode(final String code)
    {
        return brandRepository.getByCode(code);
    }

    @Override
    public List<Brand> findAll()
    {
        return brandRepository.findAll();
    }

    @Override
    public void deleteAll()
    {
        //brandRepository.deleteAll();
    }

    @Override
    public Optional<Brand> save(final Brand brand)
    {
        return Optional.ofNullable(brandRepository.save(brand));
    }

    @Override
    public Optional<Brand> update(final Brand brand)
    {
        final Optional<Brand> optBrand = brandRepository.getByCode(brand.getCode());

        if (!optBrand.isPresent())
        {
            throw new RuntimeException(
                    String.format("Cant update Brand entity. No Brand with Code [%s] found.", brand.getCode()));
        }

        final Brand saved = brandRepository.save(brand);

        return Optional.ofNullable(saved);
    }

    @Override
    public Optional<Brand> upsert(Brand brand)
    {

        if (StringUtils.isEmpty(brand.getId()))
        {
            brand.setId(brand.getName().replace(StringUtils.SPACE, "_").toLowerCase());
        }

        final Brand saved = brandRepository.save(brand);

        return Optional.ofNullable(saved);
    }
}
