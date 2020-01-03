package com.carsdb.rest.controller;

import java.util.NoSuchElementException;
import java.util.Optional;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.facade.UserFacade;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/useradmin", produces = "application/json")
public class UserController
{
    private static final Logger LOG = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserFacade userFacade;

    @RequestMapping(value = "/{username}", method = RequestMethod.GET)
    public ResponseEntity<UserDto> getUser(@PathVariable final String username)
    {
        try
        {
            final Optional<UserDto> byUsername = userFacade.getByUsername(username);

            return byUsername.map(userDto -> new ResponseEntity<>(userDto, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
        }
        catch (final Exception ex)
        {
            LOG.error(String.format("There was an error while getting the User with name [%s].", username), ex);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = RequestMethod.POST, value = "/create")
    public ResponseEntity<UserDto> createUser(@RequestBody final UserDto user)
    {
        return userFacade.createUser(user)
                .map(created -> new ResponseEntity<>(created, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }

    @RequestMapping(method = RequestMethod.PATCH, value = "/update")
    public ResponseEntity<UserDto> updateUser(@RequestBody final UserDto user)
    {
        try
        {
            return userFacade.updateUser(user)
                    .map(updated -> new ResponseEntity<>(updated, HttpStatus.OK))
                    .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
        }
        catch (final NoSuchElementException ex)
        {
            LOG.error("No User for update was found.", ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        catch (final Exception ex)
        {
            LOG.error("There was an error while getting the User for update.", ex);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/delete/{username}", method = RequestMethod.GET)
    public ResponseEntity<UserDto> deleteUser(@PathVariable final String username)
    {
        return null;
    }
}
