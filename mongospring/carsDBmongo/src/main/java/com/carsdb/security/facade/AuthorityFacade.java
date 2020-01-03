package com.carsdb.security.facade;

import java.util.List;
import java.util.Optional;

import com.carsdb.security.dto.AuthorityDto;

public interface AuthorityFacade
{
    Optional<AuthorityDto> create(final AuthorityDto authorityDto);

    Optional<AuthorityDto> update(AuthorityDto authorityDto);

    List<AuthorityDto> findAllEnabled();
}
