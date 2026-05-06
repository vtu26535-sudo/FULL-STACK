package com.event.booking.dto;

import java.math.BigDecimal;

public class BookingDetailDto {
    private Long bookingId;
    private String userName;
    private String email;
    private String userDepartment;
    private Long eventId;
    private String eventName;
    private int numberOfTickets;
    private BigDecimal totalAmount;

    public BookingDetailDto() {}

    public BookingDetailDto(Long bookingId, String userName, String email,
                            String userDepartment, Long eventId, String eventName,
                            int numberOfTickets, BigDecimal totalAmount) {
        this.bookingId = bookingId;
        this.userName = userName;
        this.email = email;
        this.userDepartment = userDepartment;
        this.eventId = eventId;
        this.eventName = eventName;
        this.numberOfTickets = numberOfTickets;
        this.totalAmount = totalAmount;
    }

    public Long getBookingId() { return bookingId; }
    public void setBookingId(Long bookingId) { this.bookingId = bookingId; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getUserDepartment() { return userDepartment; }
    public void setUserDepartment(String userDepartment) { this.userDepartment = userDepartment; }

    public Long getEventId() { return eventId; }
    public void setEventId(Long eventId) { this.eventId = eventId; }

    public String getEventName() { return eventName; }
    public void setEventName(String eventName) { this.eventName = eventName; }

    public int getNumberOfTickets() { return numberOfTickets; }
    public void setNumberOfTickets(int numberOfTickets) { this.numberOfTickets = numberOfTickets; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
