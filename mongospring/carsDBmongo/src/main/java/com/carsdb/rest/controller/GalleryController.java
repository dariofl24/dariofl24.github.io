package com.carsdb.rest.controller;

import com.carsdb.carsDBmongo.dto.GalleryDto;
import com.carsdb.carsDBmongo.entity.GalleryEntry;
import com.carsdb.carsDBmongo.facade.GalleryFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/gallery")
public class GalleryController
{
    @Autowired
    private GalleryFacade galleryFacade;

    @GetMapping("/browse/{gallery}")
    public ResponseEntity<GalleryDto> getGallery(@PathVariable(value = "gallery") final String gallery)
    {
        return galleryFacade.getGallery(gallery).map(galleryDto -> new ResponseEntity<>(galleryDto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/browse/{gallery}/{entry}")
    public ResponseEntity<GalleryEntry> getGalleryEntry(@PathVariable(value = "gallery") final String gallery,
            @PathVariable(value = "entry") final String entry)
    {
        return galleryFacade.getGalleryEntry(gallery, entry)
                .map(galleryEntry -> new ResponseEntity<>(galleryEntry, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/browse/{gallery}/{entry}/{kind}")
    public ResponseEntity<String> getGalleryEnrtyImage(@PathVariable(value = "gallery") final String gallery,
            @PathVariable(value = "entry") final String entry, @PathVariable(value = "kind") final String kind)
    {
        return galleryFacade.getImageUrl(gallery, entry, kind)
                .map(galleryEntry -> new ResponseEntity<>(galleryEntry, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PostMapping(value = "/update")
    public ResponseEntity<GalleryDto> updateGallery(final GalleryDto galleryDto)
    {
        return galleryFacade.updateGallery(galleryDto).map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @PostMapping(value = "/create")
    public ResponseEntity<GalleryDto> createGallery(final GalleryDto galleryDto)
    {
        return galleryFacade.createGallery(galleryDto).map(dto -> new ResponseEntity<>(dto, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }
}
