package com.carsdb.security.service;

import java.util.Optional;

import com.carsdb.security.entity.User;

public interface UserService
{
    Optional<User> getById(String id);

    Optional<User> getByUsername(String name);

    void save(User user);

    void delete(String name);
}
