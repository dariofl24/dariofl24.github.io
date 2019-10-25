package com.carsdb.security.facade;

import com.carsdb.security.dto.UserDto;

public interface UserFacade
{
    void createUser(UserDto userDto);

    void updateUser(UserDto userDto);

    void deleteUser(String name);

    UserDto getById(String id);

    UserDto getByUsername(String name);
}
