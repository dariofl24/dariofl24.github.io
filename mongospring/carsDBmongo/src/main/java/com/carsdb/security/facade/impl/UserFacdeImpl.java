package com.carsdb.security.facade.impl;

import java.util.NoSuchElementException;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.entity.User;
import com.carsdb.security.facade.UserFacade;
import com.carsdb.security.service.UserService;
import ma.glasnost.orika.MapperFacade;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserFacdeImpl implements UserFacade
{
    private static final String PWD_FORMAT = "{noop}%s";

    @Autowired
    private MapperFacade mapperFacade;

    @Autowired
    private UserService userService;

    @Override
    public void createUser(final UserDto userDto)
    {
        final User user = mapperFacade.map(userDto, User.class);

        user.setPassword(String.format(PWD_FORMAT, userDto.getPassword()));

        userService.save(user);
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
        mapperFacade.map(user, found);
        found.setPassword(String.format(PWD_FORMAT, user.getPassword()));

        userService.save(found);
    }

    @Override
    public UserDto getById(final String id)
    {
        final User user = userService.getById(id).orElseThrow(NoSuchElementException::new);

        return mapperFacade.map(user, UserDto.class);
    }

    @Override
    public UserDto getByUsername(final String name)
    {
        final User user = userService.getByUsername(name).orElseThrow(NoSuchElementException::new);

        return mapperFacade.map(user, UserDto.class);
    }
}
