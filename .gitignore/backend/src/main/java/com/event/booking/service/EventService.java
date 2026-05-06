package com.event.booking.service;

import com.event.booking.model.Event;
import com.event.booking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    public Event getEventDetails(@org.springframework.lang.NonNull Long id) {
        Optional<Event> event = eventRepository.findById(id);
        return event.orElse(null);
    }

    public Event updateEvent(@org.springframework.lang.NonNull Event event) {
        return eventRepository.save(event);
    }

    public Event createEvent(@org.springframework.lang.NonNull Event event) {
        return eventRepository.save(event);
    }

    public List<Event> getAllEvents() {
        return eventRepository.findAll();
    }

    public void deleteEvent(@org.springframework.lang.NonNull Long id) {
        eventRepository.deleteById(id);
    }
}
