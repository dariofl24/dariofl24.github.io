package com.carsdb.rest.controller;

import java.util.NoSuchElementException;

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
            final UserDto byUsername = userFacade.getByUsername(username);

            return new ResponseEntity<>(byUsername, HttpStatus.OK);
        }
        catch (final NoSuchElementException ex)
        {
            LOG.error(String.format("No User with name [%s] was found.", username), ex);
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        catch (final Exception ex)
        {
            LOG.error(String.format("There was an error while getting the User with name [%s].", username), ex);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = RequestMethod.POST, value = "/create")
    public ResponseEntity createUser(@RequestBody final UserDto user)
    {
        try
        {
            userFacade.createUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
        }
        catch (final Exception ex)
        {
            LOG.error("There was an error while creating the User.", ex);
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(method = RequestMethod.PATCH, value = "/update")
    public ResponseEntity updateUser(@RequestBody final UserDto user)
    {
        try
        {
            userFacade.updateUser(user);
            return new ResponseEntity<>(HttpStatus.OK);
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
