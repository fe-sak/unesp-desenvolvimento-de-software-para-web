package com.comp.reparo.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.comp.reparo.dto.AuthResponse;
import com.comp.reparo.dto.LoginRequest;
import com.comp.reparo.dto.RegisterRequest;
import com.comp.reparo.model.User;
import com.comp.reparo.model.UserRole;
import com.comp.reparo.repository.UserRepository;
import com.comp.reparo.security.JwtService;

@Service
public class AuthorizationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthorizationService(UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new IllegalArgumentException("Username already exists");
        }

        User user = new User(
                request.username(),
                passwordEncoder.encode(request.password()),
                UserRole.USER);

        if (request.name() != null) {
            user.setName(request.name());
        }

        userRepository.save(user);

        return new AuthResponse(jwtService.generateToken(user));
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.username(),
                        request.password()));

        User user = (User) authentication.getPrincipal();
        return new AuthResponse(jwtService.generateToken(user));
    }
}