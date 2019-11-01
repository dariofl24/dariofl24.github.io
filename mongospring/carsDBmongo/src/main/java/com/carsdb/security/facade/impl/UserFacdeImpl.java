package com.carsdb.security.facade.impl;

import java.util.Date;
import java.util.NoSuchElementException;
import java.util.Optional;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.entity.User;
import com.carsdb.security.facade.UserFacade;
import com.carsdb.security.service.UserService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserFacdeImpl implements UserFacade
{
    @Autowired
    private MapperFacade mapperFacade;

    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder rsaPasswordEncoder;

    @Override
    public Optional<UserDto> createUser(final UserDto userDto)
    {
        final User user = mapperFacade.map(userDto, User.class);

        user.setPassword(rsaPasswordEncoder.encode(userDto.getPassword()));
        user.setDateAdded(new Date());

        return userService.save(user).map(created -> mapperFacade.map(created, UserDto.class));
    }

    @Override
    public void deleteUser(final String name)
    {
        userService.delete(name);
    }

    @Override
    public void updateUser(final UserDto userDto)
    {
        final User user = mapperFacade.map(userDto, User.class);

        final User found = userService.getByUsername(user.getUsername())
                .orElseThrow(NoSuchElementException::new);

        user.setId(found.getId());
        user.setDateAdded(found.getDateAdded());
        mapperFacade.map(user, found);
        found.setPassword(rsaPasswordEncoder.encode(user.getPassword()));

        userService.save(found);
    }

    @Override
    public Optional<UserDto> getByUsername(final String name)
    {
        return Optional.ofNullable(userService.getByUsername(name))
                .map(user -> mapperFacade.map(user, UserDto.class));
    }

    @Override
    public Authentication getAuthentication()
    {
        return SecurityContextHolder.getContext().getAuthentication();
    }
}
