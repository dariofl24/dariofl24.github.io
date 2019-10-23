package com.carsdb.security.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "adminUser")
public class User
{
    @Id
    private Long id;

    @Indexed(unique = true)
    private String username;

    private String password;
}
