package com.carsdb.security.facade;

import java.util.Optional;

import com.carsdb.security.dto.UserDto;
import org.springframework.security.core.Authentication;

public interface UserFacade
{
    Optional<UserDto> updateUser(UserDto userDto);

    Optional<UserDto> createUser(UserDto userDto);

    void deleteUser(String name);

    Optional<UserDto> getByUsername(String name);

    Authentication getAuthentication();
}
