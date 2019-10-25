package com.carsdb.security.entity;

public enum UserAuthorities
{
    ADMIN("ADMIN"),
    CONTENT_CREATOR("CONTENT_CREATOR"),
    CONTENT_EDITOR("CONTENT_EDITOR"),
    CONTENT_PREVIEW("CONTENT_PREVIEW"),
    USER_ADMINISTRATOR("USER_ADMINISTRATOR");

    private final String code;

    private UserAuthorities(final String code)
    {
        this.code = code;
    }
}
