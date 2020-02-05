package com.carsdb.carsDBmongo.repository;

import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Gallery;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface GalleryRepository extends MongoRepository<Gallery, String>
{
    Optional<Gallery> getByCode(String code);
}
