package com.event.booking.service;

import com.event.booking.dto.BookingDetailDto;
import com.event.booking.model.Booking;
import com.event.booking.model.Event;
import com.event.booking.repository.BookingRepository;
import com.event.booking.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired private BookingRepository bookingRepository;
    @Autowired private EventRepository eventRepository;

    public List<BookingDetailDto> getAllBookingDetails() {
        List<Booking> bookings = bookingRepository.findAll();
        return bookings.stream().map(booking -> {
            String eventName = booking.getEventId() != null
                    ? eventRepository.findById(Objects.requireNonNull(booking.getEventId()))
                        .map(Event::getName).orElse("Unknown Event")
                    : "Unknown Event";

            return new BookingDetailDto(
                    booking.getId(),
                    booking.getName(),
                    booking.getEmail(),
                    booking.getDepartment(),
                    booking.getEventId(),
                    eventName,
                    booking.getNumberOfTickets(),
                    booking.getTotalAmount()
            );
        }).collect(Collectors.toList());
    }
}
