package com.carsdb.carsDBmongo.entity;

import java.util.Map;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "gallery")
public class Gallery
{
    @Id
    private String id;

    @Indexed(unique = true)
    private String code;

    private Map<String, GalleryEntry> entries;

    public String getId()
    {
        return id;
    }

    public void setId(final String id)
    {
        this.id = id;
    }

    public String getCode()
    {
        return code;
    }

    public void setCode(final String code)
    {
        this.code = code;
    }

    public Map<String, GalleryEntry> getEntries()
    {
        return entries;
    }

    public void setEntries(final Map<String, GalleryEntry> entries)
    {
        this.entries = entries;
    }
}
