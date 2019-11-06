package com.carsdb;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.entity.User;
import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.DefaultMapperFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class ApplicationWeb
{
    public static void main(String[] args)
    {
        SpringApplication.run(ApplicationWeb.class, args);
    }

    @Bean("defaultMapper")
    public MapperFacade mapperFacade()
    {
        final MapperFactory mapperFactory = new DefaultMapperFactory.Builder().build();

        return mapperFactory.getMapperFacade();
    }

    @Bean("userMapper")
    public MapperFacade userMapperFacade()
    {
        final MapperFactory mapperFactory = new DefaultMapperFactory.Builder().build();

        mapperFactory.classMap(User.class, UserDto.class).exclude("password")
                .field("username", "username")
                .field("dateAdded", "dateAdded")
                .field("authorities", "authorities")
                .field("enabled", "enabled")
                .register();

        return mapperFactory.getMapperFacade();
    }
}
