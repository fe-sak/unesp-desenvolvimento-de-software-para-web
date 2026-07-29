package com.comp.reparo.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.comp.reparo.dto.AuthResponse;
import com.comp.reparo.dto.LoginRequest;
import com.comp.reparo.dto.RegisterRequest;
import com.comp.reparo.exception.UsernameAlreadyExistsException;
import com.comp.reparo.model.Cliente;
import com.comp.reparo.model.Tecnico;
import com.comp.reparo.model.User;
import com.comp.reparo.model.UserRole;
import com.comp.reparo.repository.ClienteRepository;
import com.comp.reparo.repository.TecnicoRepository;
import com.comp.reparo.repository.UserRepository;
import com.comp.reparo.security.JwtService;

@Service
public class AuthenticationService {

    private final UserRepository userRepository;
    private final ClienteRepository clienteRepository;
    private final TecnicoRepository tecnicoRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthenticationService(
            UserRepository userRepository,
            ClienteRepository clienteRepository,
            TecnicoRepository tecnicoRepository,
            PasswordEncoder passwordEncoder,
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.userRepository = userRepository;
        this.clienteRepository = clienteRepository;
        this.tecnicoRepository = tecnicoRepository;
        this.passwordEncoder = passwordEncoder;
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.username())) {
            throw new UsernameAlreadyExistsException(request.username());
        }

        User user = new User();
        user.setUsername(request.username());
        user.setPassword(passwordEncoder.encode(request.password()));
        if (request.admin()) {
            user.setRole(UserRole.ADMIN);
        } else if (request.tecnicoId() != null) {
            if (userRepository.existsByTecnicoId(request.tecnicoId())) {
                throw new IllegalArgumentException("Ja existe um usuario para este tecnico");
            }
            user.setRole(UserRole.TECNICO);
            Tecnico tecnico = tecnicoRepository.findById(request.tecnicoId()).orElse(null);
            user.setTecnico(tecnico);
        } else {
            user.setRole(UserRole.USER);
            if (request.clienteId() != null) {
                if (userRepository.existsByClienteId(request.clienteId())) {
                    throw new IllegalArgumentException("Ja existe um usuario para este cliente");
                }
                Cliente cliente = clienteRepository.findById(request.clienteId()).orElse(null);
                user.setCliente(cliente);
            }
        }

        if (request.name() != null && !request.name().isBlank()) {
            user.setName(request.name());
        }

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest request) {
        Authentication authentication;

        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), request.password()));
        } catch (BadCredentialsException exception) {
            throw new BadCredentialsException("Invalid username or password", exception);
        }

        User user = (User) authentication.getPrincipal();
        String token = jwtService.generateToken(user);

        return new AuthResponse(token);
    }
}
