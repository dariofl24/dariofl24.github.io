package com.carsdb.security.ext;

import java.util.List;
import java.util.stream.Collectors;

import com.carsdb.security.service.UserService;
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
    private UserService userService;

    @Override
    public UserDetails loadUserByUsername(final String name) throws UsernameNotFoundException
    {
        return userService.getByUsername(name)
                .map(this::createUserForRegistry)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                String.format("The User with name [%s] can not be found.", name)));
    }

    private User createUserForRegistry(com.carsdb.security.entity.User userEntity)
    {
        return new User(userEntity.getUsername(),
                userEntity.getPassword(),
                userEntity.isEnabled(),
                true, true, true,
                loadUserAuthorities(userEntity.getAuthorities()));
    }

    private List<GrantedAuthority> loadUserAuthorities(final List<String> authorities)
    {
        if (CollectionUtils.isEmpty(authorities))
        {
            return AuthorityUtils.NO_AUTHORITIES;
        }

        return authorities.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
}
