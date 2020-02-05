package com.carsdb.carsDBmongo.dto;

import java.util.Map;

import com.carsdb.carsDBmongo.entity.GalleryEntry;

public class GalleryDto
{
    private String code;

    private Map<String, GalleryEntry> entries;

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
