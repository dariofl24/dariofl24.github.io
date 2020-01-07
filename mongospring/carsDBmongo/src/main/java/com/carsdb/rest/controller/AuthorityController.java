package com.carsdb.rest.controller;

import java.util.List;

import com.carsdb.security.dto.AuthorityDto;
import com.carsdb.security.facade.AuthorityFacade;
import org.apache.commons.collections.CollectionUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/authorityadmin", produces = "application/json")
public class AuthorityController
{
    private static final Logger LOG = LoggerFactory.getLogger(AuthorityController.class);

    @Autowired
    private AuthorityFacade authorityFacade;

    @RequestMapping(value = "/enabled", method = RequestMethod.GET)
    public ResponseEntity<List<AuthorityDto>> getEnabledAuthorities()
    {
        final List<AuthorityDto> allEnabled = authorityFacade.findAllEnabled();

        if (CollectionUtils.isNotEmpty(allEnabled))
        {
            return new ResponseEntity<>(allEnabled, HttpStatus.OK);
        }

        return new ResponseEntity<>(HttpStatus.NOT_FOUND);
    }

    @RequestMapping(method = RequestMethod.POST, value = "/create")
    public ResponseEntity<AuthorityDto> createAuthority(@RequestBody final AuthorityDto authority)
    {
        return authorityFacade.create(authority)
                .map(created -> new ResponseEntity<>(created, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR));
    }
}
