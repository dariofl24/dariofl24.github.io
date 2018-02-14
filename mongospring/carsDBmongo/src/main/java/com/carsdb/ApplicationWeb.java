package com.carsdb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import ma.glasnost.orika.MapperFacade;
import ma.glasnost.orika.MapperFactory;
import ma.glasnost.orika.impl.DefaultMapperFactory;

@SpringBootApplication
public class ApplicationWeb {
	
	public static void main(String[] args) {
        SpringApplication.run(ApplicationWeb.class, args);
    }
	
	@Bean
    public MapperFacade mapper() {
        final MapperFactory mapperFactory = new DefaultMapperFactory.Builder(). build();
        
        return mapperFactory.getMapperFacade();
    }

}
