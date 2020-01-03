package com.carsdb.security.service;

import java.util.List;
import java.util.Optional;

import com.carsdb.security.entity.Authority;

public interface AuthorityService
{
    Optional<Authority> save(Authority authority);

    Optional<Authority> getByCode(String code);

    List<Authority> findAllEnabled();

    void delete(String code);
}
