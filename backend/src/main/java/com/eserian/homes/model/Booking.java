package com.eserian.homes.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "property_id")
    private Property property;    // Which property is booked

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;            // Who booked it

    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private Double totalPrice;    // pricePerNight * numberOfNights
    private String status;        // PENDING, CONFIRMED, CANCELLED

    private LocalDateTime createdAt;
}