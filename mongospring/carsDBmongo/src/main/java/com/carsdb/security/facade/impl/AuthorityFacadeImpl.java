package com.carsdb.security.facade.impl;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

import com.carsdb.security.dto.AuthorityDto;
import com.carsdb.security.entity.Authority;
import com.carsdb.security.facade.AuthorityFacade;
import com.carsdb.security.service.AuthorityService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

@Service
public class AuthorityFacadeImpl implements AuthorityFacade
{
    @Autowired
    private AuthorityService authorityService;

    @Autowired
    @Qualifier("defaultMapper")
    private MapperFacade mapperFacade;

    @Override
    public Optional<AuthorityDto> create(final AuthorityDto authorityDto)
    {
        final Authority authority = mapperFacade.map(authorityDto, Authority.class);

        return authorityService.save(authority)
                .map(auth -> mapperFacade.map(auth, AuthorityDto.class));
    }

    @Override
    public Optional<AuthorityDto> update(final AuthorityDto authorityDto)
    {
        final Authority authority = mapperFacade.map(authorityDto, Authority.class);

        final Authority found = authorityService.getByCode(authority.getCode())
                .orElseThrow(NoSuchElementException::new);

        authority.setId(found.getId());
        mapperFacade.map(authority, found);

        return authorityService.save(found).map(auth -> mapperFacade.map(auth, AuthorityDto.class));
    }

    @Override
    public List<AuthorityDto> findAllEnabled()
    {
        return authorityService.findAllEnabled().stream()
                .map(auth -> mapperFacade.map(auth, AuthorityDto.class))
                .collect(Collectors.toList());
    }
}
