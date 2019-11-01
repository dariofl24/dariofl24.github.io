package com.carsdb.security.service.impl;

import java.util.Optional;

import com.carsdb.security.entity.User;
import com.carsdb.security.repository.UserRepository;
import com.carsdb.security.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService
{
    @Autowired
    private UserRepository userRepository;

    @Override
    public Optional<User> getById(final String id)
    {
        return userRepository.getById(id);
    }

    @Override
    public Optional<User> getByUsername(final String name)
    {
        return userRepository.getByUsername(name);
    }

    @Override
    public Optional<User> save(final User user)
    {
        final User save = userRepository.save(user);
        return Optional.ofNullable(save);
    }

    @Override
    public void delete(final String name)
    {
        userRepository.deleteByUsername(name);
    }
}
