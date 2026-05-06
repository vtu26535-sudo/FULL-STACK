package com.event.booking;

import com.event.booking.model.Event;
import com.event.booking.model.Role;
import com.event.booking.model.User;
import com.event.booking.repository.EventRepository;
import com.event.booking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired private UserRepository userRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Seed admin user
        if (userRepository.findByEmail("admin@eventhub.com").isEmpty()) {
            User admin = new User();
            admin.setName("Admin");
            admin.setEmail("admin@eventhub.com");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setDepartment("Administration");
            admin.setRole(Role.ADMIN);
            userRepository.save(admin);
            System.out.println("✅ Admin user seeded: admin@eventhub.com / admin123");
        }

        // Seed demo student user
        if (userRepository.findByEmail("student@eventhub.com").isEmpty()) {
            User student = new User();
            student.setName("Demo Student");
            student.setEmail("student@eventhub.com");
            student.setPassword(passwordEncoder.encode("student123"));
            student.setDepartment("Engineering");
            student.setRole(Role.USER);
            userRepository.save(student);
            System.out.println("✅ Student user seeded: student@eventhub.com / student123");
        }

        // Seed event
        if (eventRepository.count() == 0) {
            Event event = new Event();
            event.setName("Annual Tech Symposium");
            event.setDepartment("Engineering");
            event.setEventDateTime("2026-05-15T10:00:00");
            event.setVenue("Main Auditorium");
            event.setTicketPrice(new BigDecimal("10.00"));
            event.setAvailableTickets(100);
            eventRepository.save(event);
            System.out.println("✅ Event seeded: Annual Tech Symposium");
        }
    }
}
