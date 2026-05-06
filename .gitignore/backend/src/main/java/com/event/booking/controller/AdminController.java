package com.event.booking.controller;

import com.event.booking.dto.BookingDetailDto;
import com.event.booking.model.Event;
import com.event.booking.service.AdminService;
import com.event.booking.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private AdminService adminService;

    @Autowired
    private EventService eventService;

    // ── Bookings ──────────────────────────────────────────────────────────────

    @GetMapping("/bookings")
    public ResponseEntity<List<BookingDetailDto>> getAllBookings() {
        return ResponseEntity.ok(adminService.getAllBookingDetails());
    }

    // ── Events ────────────────────────────────────────────────────────────────

    @PostMapping("/events")
    public ResponseEntity<Event> createEvent(
            @RequestBody @org.springframework.lang.NonNull Event event) {
        Event created = eventService.createEvent(event);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @DeleteMapping("/events/{id}")
    public ResponseEntity<?> deleteEvent(@PathVariable Long id) {
        eventService.deleteEvent(java.util.Objects.requireNonNull(id, "Event ID must not be null"));
        return ResponseEntity.ok().build();
    }
}
