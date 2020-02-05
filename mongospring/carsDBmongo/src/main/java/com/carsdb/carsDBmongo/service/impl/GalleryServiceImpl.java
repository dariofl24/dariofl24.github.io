package com.carsdb.carsDBmongo.service.impl;

import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Gallery;
import com.carsdb.carsDBmongo.entity.GalleryEntry;
import com.carsdb.carsDBmongo.repository.GalleryRepository;
import com.carsdb.carsDBmongo.service.GalleryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class GalleryServiceImpl implements GalleryService
{
    @Autowired
    private GalleryRepository galleryRepository;

    @Override
    public Gallery save(final Gallery gallery)
    {
        return galleryRepository.save(gallery);
    }

    @Override
    public Optional<Gallery> getGalleryByCode(final String galleryCode)
    {
        return galleryRepository.getByCode(galleryCode);
    }

    @Override
    public Optional<GalleryEntry> getGalleryEntryByCode(final String galleryCode, final String entryCode)
    {
        return galleryRepository.getByCode(galleryCode).map(gallery -> gallery.getEntries())
                .map(entry -> entry.get(entryCode));
    }
}
