package com.carsdb.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class PasswordEncodingException extends RuntimeException
{
    public PasswordEncodingException(String msg)
    {
        super(msg);
    }

    public PasswordEncodingException(String msg, Throwable cause)
    {
        super(msg, cause);
    }
}
