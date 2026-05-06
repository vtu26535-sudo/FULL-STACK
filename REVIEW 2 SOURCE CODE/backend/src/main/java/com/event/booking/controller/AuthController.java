package com.event.booking.controller;

import com.event.booking.dto.AuthRequest;
import com.event.booking.dto.AuthResponse;
import com.event.booking.dto.RegisterRequest;
import com.event.booking.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest req) {
        try {
            AuthResponse response = userService.register(req);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest req) {
        try {
            AuthResponse response = userService.login(req);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(e.getMessage());
        }
    }

    @Autowired
    private com.event.booking.service.FirebaseService firebaseService;

    @PostMapping("/firebase-sync")
    public ResponseEntity<?> firebaseSync(@RequestHeader("Authorization") String authorizationHeader) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(401).body("Missing or invalid Authorization header");
            }
            String idToken = authorizationHeader.substring(7);
            com.google.firebase.auth.FirebaseToken decodedToken = firebaseService.verifyIdToken(idToken);
            String email = decodedToken.getEmail();
            String name = decodedToken.getName();

            AuthResponse response = userService.firebaseSync(email, name);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Firebase authentication failed: " + e.getMessage());
        }
    }
}
