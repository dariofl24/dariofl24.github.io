package com.carsdb.carsDBmongo.facade;

import java.util.Optional;

import com.carsdb.carsDBmongo.dto.GalleryDto;
import com.carsdb.carsDBmongo.entity.GalleryEntry;

public interface GalleryFacade
{
    Optional<GalleryDto> createGallery(GalleryDto galleryDto);

    Optional<GalleryDto> updateGallery(GalleryDto galleryDto);

    Optional<GalleryDto> getGallery(String code);

    Optional<GalleryEntry> getGalleryEntry(String galleryCode, String entryCode);

    Optional<String> getImageUrl(String galleryCode, String entryCode, String type);
}
