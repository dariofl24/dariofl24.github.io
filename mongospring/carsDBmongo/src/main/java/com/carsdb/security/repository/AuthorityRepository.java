package com.carsdb.security.repository;

import java.util.List;
import java.util.Optional;

import com.carsdb.security.entity.Authority;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface AuthorityRepository extends MongoRepository<Authority, String>
{
    List<Authority> findAllByEnabled(boolean enabled);

    Optional<Authority> getByCode(String code);
}
