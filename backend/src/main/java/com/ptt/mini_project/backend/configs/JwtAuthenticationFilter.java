package com.ptt.mini_project.backend.configs;


import com.ptt.mini_project.backend.repositories.UserRepository;
import com.ptt.mini_project.backend.services.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter{

    private final JwtService jwtService;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        logger.info("JWT Filter processing request: " + request.getMethod() + " " + request.getRequestURI());

        String authHeader = request.getHeader("Authorization");
        logger.info("Authorization header: " + authHeader);

        if(authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.info("Invalid authorization header format");
            filterChain.doFilter(request, response);
            return;
        }

        String jwtToken = authHeader.substring(7);
        String username = jwtService.extractUsername(jwtToken);
        logger.info("Extracted username: " + username);

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if(username != null && authentication == null) {
            UserDetails userDetails = userDetailsService.loadUserByUsername(username);
            logger.info("Loaded user details for: " + userDetails.getUsername());

            boolean isValid = jwtService.isValidToken(jwtToken, userDetails);
            logger.info("Token valid: " + isValid);

            if(isValid) {
                UsernamePasswordAuthenticationToken authenticationToken =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );
                authenticationToken.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );
                SecurityContextHolder.getContext().setAuthentication(authenticationToken);
                logger.info("Authentication set in SecurityContext");
            }
        }
        filterChain.doFilter(request, response);
    }

}
