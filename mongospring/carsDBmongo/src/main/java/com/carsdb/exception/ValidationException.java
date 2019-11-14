package com.carsdb.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
public class ValidationException extends RuntimeException
{
    public ValidationException(String msg)
    {
        super(msg);
    }

    public ValidationException(String msg, Throwable cause)
    {
        super(msg, cause);
    }
}
