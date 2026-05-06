package com.event.booking.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

import jakarta.annotation.PostConstruct;
import java.io.InputStream;

@Service
public class FirebaseService {

    @Value("${firebase.config.path}")
    private Resource firebaseConfigPath;

    @PostConstruct
    public void initialize() {
        try {
            if (!firebaseConfigPath.exists()) {
                System.err.println("Firebase config file not found at " + firebaseConfigPath.getDescription() + ". Firebase Auth will not work until you add this file.");
                return;
            }
            InputStream serviceAccount = firebaseConfigPath.getInputStream();

            FirebaseOptions options = FirebaseOptions.builder()
                    .setCredentials(GoogleCredentials.fromStream(serviceAccount))
                    .build();

            if (FirebaseApp.getApps().isEmpty()) {
                FirebaseApp.initializeApp(options);
                System.out.println("Firebase App initialized successfully.");
            }
        } catch (Exception e) {
            System.err.println("Error initializing Firebase: " + e.getMessage());
        }
    }

    public FirebaseToken verifyIdToken(String idToken) throws Exception {
        if (FirebaseApp.getApps().isEmpty()) {
            throw new Exception("Firebase App is not initialized. Please configure the service account JSON.");
        }
        return FirebaseAuth.getInstance().verifyIdToken(idToken);
    }
}
