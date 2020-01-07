package com.carsdb.rest.controller;

import java.util.Date;
import java.util.concurrent.atomic.AtomicLong;

import com.carsdb.rest.dto.Greeting;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class GreetingController
{
    private static final String template = "Hello, %s!";

    private final AtomicLong counter = new AtomicLong();

    private final Date date = new Date();

    @RequestMapping(value = "/ok", produces = { MediaType.APPLICATION_JSON_VALUE })
    public Greeting greeting(@RequestParam(value = "name", defaultValue = "World") String name)
    {
        return new Greeting(counter.incrementAndGet(),
                String.format(template, name + " " + date));
    }
}
