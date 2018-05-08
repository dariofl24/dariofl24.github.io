package com.carsdb.carsDBmongo.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.entity.DocumentState;

public interface CarModelInfoRepository extends MongoRepository<CarModelInfo, String> {

	Optional<CarModelInfo> getById(String id);

	Optional<CarModelInfo> getByGeneration(int generation);

	Optional<List<CarModelInfo>> findFirst10ByOrderByDateAddedDesc();

	Optional<List<CarModelInfo>> findFirst10ByDocumentStateAndFeaturedOrderByDateAddedDesc(DocumentState documentState,
			boolean featured);

	Optional<List<CarModelInfo>> findByName(String name);

	Optional<List<CarModelInfo>> findByManufacturer(String manufacturer);

	Optional<List<CarModelInfo>> findByYear(int year);

	Page<CarModelInfo> findAllByOrderByDateAddedDesc(Pageable pageable);

}
