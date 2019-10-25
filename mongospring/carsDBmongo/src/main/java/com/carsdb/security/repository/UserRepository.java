package com.carsdb.security.repository;

import java.util.Optional;

import com.carsdb.security.entity.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

public interface UserRepository extends MongoRepository<User, String>
{
    @Query(fields = "{ 'username' : 1, 'authorities' : 1}")
    Optional<User> getById(String id);

    Optional<User> getByUsername(String name);

    void deleteByUsername(String name);
}
