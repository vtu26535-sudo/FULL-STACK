package com.event.booking.controller;

import com.event.booking.model.Event;
import com.event.booking.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "*") // Allows cross-origin requests from React
public class EventController {

    @Autowired
    private EventService eventService;

    @GetMapping
    public ResponseEntity<List<Event>> getAllActiveEvents() {
        return ResponseEntity.ok(eventService.getAllEvents());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable @org.springframework.lang.NonNull Long id) {
        Event event = eventService.getEventDetails(id);
        if (event != null) {
            return ResponseEntity.ok(event);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/update")
    public ResponseEntity<Event> updateEvent(@RequestBody @org.springframework.lang.NonNull Event event) {
        return ResponseEntity.ok(eventService.updateEvent(event));
    }
}
