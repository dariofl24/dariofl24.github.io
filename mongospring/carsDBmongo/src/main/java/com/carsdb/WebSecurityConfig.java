package com.carsdb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{
    private static final String[] PUBLIC_RESOURCES = { "/**/*.ico", "/mysupercars/**", "/vendor/**", "/css/**",
            "/fonts/**", "/images/**", "/js/**", "/latest/**", "/webjars/**" };

    private static final String[] PUBLIC_PAGES = { "/", "/home", "/model/*" };

    private static final String[] PUBLIC_REST_ENDPOINTS = { "/api/useradmin/*" };

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http.csrf().disable().authorizeRequests()
                .antMatchers(PUBLIC_RESOURCES).permitAll()
                .antMatchers(PUBLIC_PAGES).permitAll()
                .antMatchers(PUBLIC_REST_ENDPOINTS).permitAll()
                .antMatchers("/admin/**").hasAnyAuthority(new String[]{"ADMIN"})
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").permitAll()
                .and()
                .logout().permitAll();
    }

//    @Autowired
//    public void configureGlobal(AuthenticationManagerBuilder auth) throws Exception
//    {
//        auth.inMemoryAuthentication()
//                .withUser("admin").password("{noop}nimda").roles("USER")
//                .and()
//                .withUser("mika").password("{noop}1234").roles("USER");
//    }
}
