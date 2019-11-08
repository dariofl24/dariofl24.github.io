package com.carsdb.security.entity;

public enum UserAuthorities
{
    ADMIN("ADMIN"),
    CONTENT_CREATOR("CONTENT_CREATOR"),
    CONTENT_EDITOR("CONTENT_EDITOR"),
    USER_ADMINISTRATOR("USER_ADMINISTRATOR");

    private final String code;

    UserAuthorities(final String code)
    {
        this.code = code;
    }
}
