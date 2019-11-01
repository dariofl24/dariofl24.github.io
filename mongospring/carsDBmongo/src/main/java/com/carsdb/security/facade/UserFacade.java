package com.carsdb.security.facade;

import java.util.Optional;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.entity.User;
import org.springframework.security.core.Authentication;

public interface UserFacade
{
    void updateUser(UserDto userDto);

    void deleteUser(String name);

    Optional<UserDto> createUser(UserDto userDto);

    Optional<UserDto> getByUsername(String name);

    Authentication getAuthentication();
}
