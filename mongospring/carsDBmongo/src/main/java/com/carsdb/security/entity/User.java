package com.carsdb.security.entity;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminUser")
public class User
{
    @Id
    private String id;

    @Indexed(unique = true)
    private String username;

    private String password;

    private List<String> authorities;

    private boolean enabled;

    public boolean isEnabled()
    {
        return enabled;
    }

    public void setEnabled(final boolean enabled)
    {
        this.enabled = enabled;
    }

    public String getId()
    {
        return id;
    }

    public void setId(final String id)
    {
        this.id = id;
    }

    public String getUsername()
    {
        return username;
    }

    public void setUsername(final String username)
    {
        this.username = username;
    }

    public String getPassword()
    {
        return password;
    }

    public void setPassword(final String password)
    {
        this.password = password;
    }

    public List<String> getAuthorities()
    {
        return authorities;
    }

    public void setAuthorities(final List<String> authorities)
    {
        this.authorities = authorities;
    }
}
