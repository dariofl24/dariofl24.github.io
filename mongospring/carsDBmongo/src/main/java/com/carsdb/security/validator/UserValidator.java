package com.carsdb.security.validator;

import com.carsdb.security.dto.UserDto;

public interface UserValidator
{
    void validateUser(final UserDto userDto);
}
