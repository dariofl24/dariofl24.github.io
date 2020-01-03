package com.carsdb.security.service.impl;

import java.util.List;
import java.util.Optional;

import com.carsdb.security.entity.Authority;
import com.carsdb.security.repository.AuthorityRepository;
import com.carsdb.security.service.AuthorityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AuthorityServiceImpl implements AuthorityService
{
    private static final Boolean _ENABLED_ = true;

    @Autowired
    private AuthorityRepository authorityRepository;

    @Override
    public Optional<Authority> save(final Authority authority)
    {
        final Authority saved = authorityRepository.save(authority);
        return Optional.of(saved);
    }

    @Override
    public Optional<Authority> getByCode(final String code)
    {
        return authorityRepository.getByCode(code);
    }

    @Override
    public List<Authority> findAllEnabled()
    {
        return authorityRepository.findAllByEnabled(_ENABLED_);
    }

    @Override
    public void delete(final String code)
    {
        getByCode(code).ifPresent(authorityRepository::delete);
    }
}
