package com.carsdb.carsDBmongo.facade.impl;

import java.lang.reflect.InvocationTargetException;
import java.util.Optional;

import com.carsdb.carsDBmongo.dto.GalleryDto;
import com.carsdb.carsDBmongo.entity.Gallery;
import com.carsdb.carsDBmongo.entity.GalleryEntry;
import com.carsdb.carsDBmongo.facade.GalleryFacade;
import com.carsdb.carsDBmongo.service.GalleryService;
import ma.glasnost.orika.MapperFacade;
import org.apache.commons.beanutils.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class GalleryFacadeImpl implements GalleryFacade
{
    @Autowired
    private GalleryService galleryService;

    @Autowired
    @Qualifier("defaultMapper")
    private MapperFacade mapperFacade;

    @Override
    public Optional<GalleryDto> createGallery(final GalleryDto galleryDto)
    {
        final Gallery saved = galleryService.save(mapperFacade.map(galleryDto, Gallery.class));

        return Optional.ofNullable(saved).map(model -> mapperFacade.map(model, GalleryDto.class));
    }

    @Override
    public Optional<GalleryDto> updateGallery(final GalleryDto galleryDto)
    {
        final Gallery target = galleryService.getGalleryByCode(galleryDto.getCode()).orElseThrow();

        final Gallery source = mapperFacade.map(galleryDto, Gallery.class);

        source.setId(target.getId());
        mapperFacade.map(source, target);

        final Gallery saved = galleryService.save(target);

        return Optional.ofNullable(saved).map(model -> mapperFacade.map(model, GalleryDto.class));
    }

    @Override
    public Optional<GalleryDto> getGallery(final String code)
    {
        return galleryService.getGalleryByCode(code)
                .map(model -> mapperFacade.map(model, GalleryDto.class));
    }

    @Override
    public Optional<GalleryEntry> getGalleryEntry(final String galleryCode, final String entryCode)
    {
        return galleryService.getGalleryByCode(galleryCode)
                .map(gallery -> gallery.getEntries())
                .map(entries -> entries.get(entryCode));
    }

    @Override
    public Optional<String> getImageUrl(final String galleryCode, final String entryCode, final String type)
    {
        return galleryService.getGalleryByCode(galleryCode)
                .map(gallery -> gallery.getEntries())
                .map(entries -> entries.get(entryCode))
                .map(entry -> extractProperty(entry, type));
    }

    private String extractProperty(final GalleryEntry entry, final String type)
    {
        try
        {
            return BeanUtils.getProperty(entry, type);
        }
        catch (IllegalAccessException | InvocationTargetException | NoSuchMethodException e)
        {
            e.printStackTrace();
        }
        return null;
    }
}
