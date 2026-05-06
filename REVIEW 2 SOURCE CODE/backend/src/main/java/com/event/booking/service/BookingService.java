package com.event.booking.service;

import com.event.booking.model.Booking;
import com.event.booking.model.Event;
import com.event.booking.repository.BookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;

@Service
public class BookingService {

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.id}")
    private String razorpayKeyId;

    @org.springframework.beans.factory.annotation.Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private EventService eventService;

    @Transactional
    public Booking createBooking(@org.springframework.lang.NonNull Booking booking) throws Exception {
        Long eventId = java.util.Objects.requireNonNull(booking.getEventId(), "Event ID cannot be null");
        Event event = eventService.getEventDetails(eventId);
        
        if (event == null) {
            throw new Exception("Event not found");
        }

        try {
            java.time.LocalDateTime eventTime = java.time.LocalDateTime.parse(event.getEventDateTime());
            if (java.time.LocalDateTime.now().isAfter(eventTime)) {
                throw new Exception("Time completed! Event registration deadline has passed.");
            }
        } catch (java.time.format.DateTimeParseException e) {
            // If date is unparseable, we can let it pass or handle it. Let's let it pass for safety.
        }

        if (event.getAvailableTickets() < booking.getNumberOfTickets()) {
            throw new Exception("Not enough tickets available");
        }

        // Calculate total amount
        BigDecimal totalAmount = event.getTicketPrice().multiply(new BigDecimal(booking.getNumberOfTickets()));
        booking.setTotalAmount(totalAmount);

        // Update available tickets
        event.setAvailableTickets(event.getAvailableTickets() - booking.getNumberOfTickets());
        eventService.updateEvent(event);

        booking.setPaymentStatus("PENDING");

        try {
            if ("rzp_test_YourTestKeyIdHere".equals(razorpayKeyId)) {
                // MOCK MODE: Bypass Razorpay SDK
                booking.setRazorpayOrderId("mock_order_" + System.currentTimeMillis());
            } else {
                com.razorpay.RazorpayClient razorpay = new com.razorpay.RazorpayClient(razorpayKeyId, razorpayKeySecret);
                
                org.json.JSONObject orderRequest = new org.json.JSONObject();
                // amount in paise
                orderRequest.put("amount", totalAmount.multiply(new BigDecimal("100")).intValue());
                orderRequest.put("currency", "INR");
                orderRequest.put("receipt", "txn_" + System.currentTimeMillis());

                com.razorpay.Order razorpayOrder = razorpay.orders.create(orderRequest);
                booking.setRazorpayOrderId(razorpayOrder.get("id"));
            }
        } catch (Exception e) {
            throw new Exception("Error creating Razorpay order: " + e.getMessage());
        }

        // Save and return booking
        return bookingRepository.save(booking);
    }

    public java.util.Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }
    
    public void updateBooking(Booking booking) {
        bookingRepository.save(booking);
    }

    public java.util.List<com.event.booking.dto.BookingDetailDto> getUserBookingDetails(Long userId) {
        java.util.List<Booking> bookings = bookingRepository.findByUserId(userId);
        return bookings.stream().map(booking -> {
            String eventName = booking.getEventId() != null
                    ? java.util.Optional.ofNullable(eventService.getEventDetails(java.util.Objects.requireNonNull(booking.getEventId())))
                        .map(Event::getName).orElse("Unknown Event")
                    : "Unknown Event";

            return new com.event.booking.dto.BookingDetailDto(
                    booking.getId(),
                    booking.getName(),
                    booking.getEmail(),
                    booking.getDepartment(),
                    booking.getEventId(),
                    eventName,
                    booking.getNumberOfTickets(),
                    booking.getTotalAmount()
            );
        }).collect(java.util.stream.Collectors.toList());
    }
}
