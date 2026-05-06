package com.event.booking.controller;

import com.event.booking.model.Booking;
import com.event.booking.model.User;
import com.event.booking.service.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/book")
@CrossOrigin(origins = "*")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody Booking booking,
                                           Authentication authentication) {
        try {
            if (booking.getEventId() == null) {
                booking.setEventId(1L);
            }

            // Link booking to the authenticated user and pre-fill info
            if (authentication != null && authentication.getPrincipal() instanceof User user) {
                booking.setUserId(user.getId());
                if (booking.getName() == null || booking.getName().isBlank()) {
                    booking.setName(user.getName());
                }
                if (booking.getEmail() == null || booking.getEmail().isBlank()) {
                    booking.setEmail(user.getEmail());
                }
                if (booking.getDepartment() == null || booking.getDepartment().isBlank()) {
                    booking.setDepartment(user.getDepartment());
                }
            }

            Booking createdBooking = bookingService.createBooking(booking);
            return new ResponseEntity<>(createdBooking, HttpStatus.CREATED);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getMyBookings(Authentication authentication) {
        if (authentication != null && authentication.getPrincipal() instanceof User user) {
            return ResponseEntity.ok(bookingService.getUserBookingDetails(user.getId()));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
    }
}
