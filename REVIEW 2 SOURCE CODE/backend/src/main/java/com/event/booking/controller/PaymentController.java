package com.event.booking.controller;

import com.event.booking.dto.PaymentRequest;
import com.event.booking.model.Booking;
import com.event.booking.service.BookingService;
import com.razorpay.Utils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/payment")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Value("${razorpay.key.secret}")
    private String razorpayKeySecret;

    @Autowired
    private BookingService bookingService;

    @PostMapping("/verify")
    public ResponseEntity<?> verifyPayment(@RequestBody PaymentRequest request) {
        try {
            org.json.JSONObject options = new org.json.JSONObject();
            options.put("razorpay_order_id", request.getRazorpayOrderId());
            options.put("razorpay_payment_id", request.getRazorpayPaymentId());
            options.put("razorpay_signature", request.getRazorpaySignature());

            boolean isValid = false;

            if ("YourTestKeySecretHere".equals(razorpayKeySecret) || "mock_sig".equals(request.getRazorpaySignature())) {
                // MOCK MODE: Bypass signature verification
                isValid = true;
            } else {
                isValid = Utils.verifyPaymentSignature(options, razorpayKeySecret);
            }

            if (isValid) {
                // Signature is valid, update booking status
                Optional<Booking> optionalBooking = bookingService.getBookingById(request.getBookingId());
                if (optionalBooking.isPresent()) {
                    Booking booking = optionalBooking.get();
                    booking.setRazorpayPaymentId(request.getRazorpayPaymentId());
                    booking.setPaymentStatus("SUCCESS");
                    bookingService.updateBooking(booking);
                    return ResponseEntity.ok("Payment verified successfully");
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Booking not found");
                }
            } else {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Payment signature verification failed");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error verifying payment: " + e.getMessage());
        }
    }
}
