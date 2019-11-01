package com.carsdb.security.ext;

import java.util.List;
import java.util.stream.Collectors;

import com.carsdb.security.dto.UserDto;
import com.carsdb.security.facade.UserFacade;
import org.apache.commons.collections.CollectionUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

@Component
public class MongoUserDetailsService implements UserDetailsService
{
    @Autowired
    private UserFacade userFacade;

    @Override
    public UserDetails loadUserByUsername(final String name) throws UsernameNotFoundException
    {
        final UserDto byUsername = userFacade.getByUsername(name).orElseThrow(() ->
                new UsernameNotFoundException(String.format("The User with name [%s] can not be found.", name)));

        return new User(byUsername.getUsername(),
                byUsername.getPassword(),
                byUsername.isEnabled(),
                true, true, true,
                loadUserAuthorities(byUsername.getAuthorities()));
    }

    private List<GrantedAuthority> loadUserAuthorities(final List<String> authorities)
    {
        if (CollectionUtils.isNotEmpty(authorities))
        {
            return authorities.stream()
                    .map(SimpleGrantedAuthority::new)
                    .collect(Collectors.toList());
        }

        return AuthorityUtils.NO_AUTHORITIES;
    }
}
