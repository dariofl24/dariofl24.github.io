package com.carsdb.security.dto;

import java.util.Date;
import java.util.List;

public class UserDto
{
    private String username;

    private String password;

    private boolean enabled;

    private Date dateAdded;

    private List<String> authorities;

    public boolean isEnabled()
    {
        return enabled;
    }

    public void setEnabled(final boolean enabled)
    {
        this.enabled = enabled;
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

    public Date getDateAdded()
    {
        return dateAdded;
    }

    public void setDateAdded(final Date dateAdded)
    {
        this.dateAdded = dateAdded;
    }
}
