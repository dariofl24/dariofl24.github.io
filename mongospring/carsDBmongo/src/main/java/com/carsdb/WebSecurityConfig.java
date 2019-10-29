package com.carsdb;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{
    private static final String[] PUBLIC_RESOURCES = { "/**/*.ico", "/mysupercars/**", "/vendor/**", "/css/**",
            "/fonts/**", "/images/**", "/js/**", "/latest/**", "/webjars/**" };

    private static final String[] PUBLIC_PAGES = { "/", "/home", "/model/*" };

    private static final String[] PUBLIC_REST_ENDPOINTS = { "/api/useradmin/*" };

    @Autowired
    private UserDetailsService mongoUserDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http.csrf().disable().authorizeRequests()
                .antMatchers(PUBLIC_RESOURCES).permitAll()
                .antMatchers(PUBLIC_PAGES).permitAll()
                .antMatchers(PUBLIC_REST_ENDPOINTS).permitAll()
                .antMatchers("/admin/**","/api/**").hasAnyAuthority(new String[] { "ADMIN" })
                .antMatchers("/preview/**").hasAnyAuthority(new String[] { "ADMIN","CONTENT_CREATOR","CONTENT_EDITOR" })
                .anyRequest().authenticated()
                .and()
                .formLogin().loginPage("/login").permitAll()
                .and()
                .logout().logoutUrl("/logout").logoutSuccessUrl("/login").permitAll();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth)
    {
        auth.authenticationProvider(authProvider());
    }

    @Bean
    public DaoAuthenticationProvider authProvider()
    {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(mongoUserDetailsService);
        authProvider.setPasswordEncoder(bCryptPasswordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder bCryptPasswordEncoder()
    {
        return new BCryptPasswordEncoder(11);
    }
}
