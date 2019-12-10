package com.carsdb.security.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "Authority")
public class Authority
{
    @Id
    private String id;

    @Indexed(unique = true)
    private String code;

    private boolean enabled;

    public String getId()
    {
        return id;
    }

    public void setId(final String id)
    {
        this.id = id;
    }

    public boolean isEnabled()
    {
        return enabled;
    }

    public void setEnabled(final boolean enabled)
    {
        this.enabled = enabled;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(final String code)
    {
        this.code = code;
    }
}
