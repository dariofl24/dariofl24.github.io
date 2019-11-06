package com.carsdb;

import com.carsdb.security.ext.RsaPasswordEncoder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
@EnableWebSecurity
public class WebSecurityConfig extends WebSecurityConfigurerAdapter
{
    private static final String[] PUBLIC_RESOURCES = { "/**/*.ico", "/mysupercars/**", "/vendor/**", "/css/**",
            "/fonts/**", "/images/**", "/js/**", "/latest/**", "/webjars/**" };

    private static final String[] PUBLIC_PAGES = { "/", "/home", "/model/*","/ok" };

    private static final String[] PROTECTED_PAGES = { "/admin/**", "/preview/**" };

    private static final String[] PUBLIC_REST_ENDPOINTS = { "/api/useradmin/*" };

    private static final String[] PROTECTED_REST_ENDPOINTS = { "/api/**" };

    @Autowired
    private UserDetailsService mongoUserDetailsService;

    @Override
    protected void configure(HttpSecurity http) throws Exception
    {
        http.csrf().disable().authorizeRequests()
                .antMatchers(PUBLIC_RESOURCES).permitAll()
                .antMatchers(PUBLIC_PAGES).permitAll()
                .antMatchers(PROTECTED_PAGES)
                .hasAnyAuthority(new String[] { "ADMIN", "CONTENT_CREATOR", "CONTENT_EDITOR" })
                .antMatchers(PUBLIC_REST_ENDPOINTS).permitAll()
                .antMatchers(PROTECTED_REST_ENDPOINTS).hasAnyAuthority(new String[] { "ADMIN" })
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
        final DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(mongoUserDetailsService);
        authProvider.setPasswordEncoder(rsaPasswordEncoder());
        return authProvider;
    }

    @Bean
    public PasswordEncoder rsaPasswordEncoder()
    {
        return new RsaPasswordEncoder();
    }
}
