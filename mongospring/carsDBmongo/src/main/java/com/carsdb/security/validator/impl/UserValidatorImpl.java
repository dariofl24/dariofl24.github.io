package com.carsdb.security.validator.impl;

import com.carsdb.exception.ValidationException;
import com.carsdb.security.dto.UserDto;
import com.carsdb.security.validator.UserValidator;
import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class UserValidatorImpl implements UserValidator
{
    @Override
    public void validateUser(final UserDto userDto)
    {
        if (StringUtils.isEmpty(userDto.getUsername()))
        {
            throw new ValidationException("User name is null or empty.");
        }

        if (StringUtils.isEmpty(userDto.getPassword()) || StringUtils.isEmpty(userDto.getConfirmPassword()))
        {
            throw new ValidationException("Password is not valid");
        }

        if (ObjectUtils.notEqual(userDto.getPassword(), userDto.getConfirmPassword()))
        {
            throw new ValidationException("Password does not match.");
        }
    }
}
