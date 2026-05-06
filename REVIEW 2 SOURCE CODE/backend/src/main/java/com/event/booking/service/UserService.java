package com.event.booking.service;

import com.event.booking.dto.AuthRequest;
import com.event.booking.dto.AuthResponse;
import com.event.booking.dto.RegisterRequest;
import com.event.booking.model.Role;
import com.event.booking.model.User;
import com.event.booking.repository.UserRepository;
import com.event.booking.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired private UserRepository userRepository;
    @Autowired private PasswordEncoder passwordEncoder;
    @Autowired private JwtUtil jwtUtil;

    public AuthResponse register(RegisterRequest req) throws Exception {
        if (userRepository.findByEmail(req.getEmail()).isPresent()) {
            throw new Exception("Email is already registered. Please log in.");
        }
        User user = new User();
        user.setName(req.getName());
        user.setEmail(req.getEmail());
        user.setPassword(passwordEncoder.encode(req.getPassword()));
        user.setDepartment(req.getDepartment());
        user.setRole(Role.USER);
        userRepository.save(user);

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name(), user.getName());
    }

    public AuthResponse login(AuthRequest req) throws Exception {
        User user = userRepository.findByEmail(req.getEmail())
                .orElseThrow(() -> new Exception("Invalid email or password."));

        if (!passwordEncoder.matches(req.getPassword(), user.getPassword())) {
            throw new Exception("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name(), user.getName());
    }

    public AuthResponse firebaseSync(String email, String name) {
        User user = userRepository.findByEmail(email).orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name != null && !name.isEmpty() ? name : "Firebase User");
            newUser.setPassword(passwordEncoder.encode(java.util.UUID.randomUUID().toString())); // dummy pass
            newUser.setRole(Role.USER);
            newUser.setDepartment("General"); // Default
            return userRepository.save(newUser);
        });

        String token = jwtUtil.generateToken(user);
        return new AuthResponse(token, user.getRole().name(), user.getName());
    }
}
