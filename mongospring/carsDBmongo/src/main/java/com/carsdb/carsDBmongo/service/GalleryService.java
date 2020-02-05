package com.carsdb.carsDBmongo.service;

import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Gallery;
import com.carsdb.carsDBmongo.entity.GalleryEntry;

public interface GalleryService
{
    Gallery save(Gallery gallery);

    Optional<Gallery> getGalleryByCode(String galleryCode);

    Optional<GalleryEntry> getGalleryEntryByCode(String galleryCode, String entryCode);
}
