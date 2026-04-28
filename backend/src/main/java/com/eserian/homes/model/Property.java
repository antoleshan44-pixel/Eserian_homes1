package com.eserian.homes.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "properties")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Property {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;        // "Cozy Beachfront Villa"
    private String description;  // Detailed description
    private String location;     // City or address
    private Double pricePerNight; // $150 per night
    private Integer bedrooms;
    private Integer bathrooms;
    private String imageUrl;      // Photo URL

    private String status;        // PENDING, APPROVED, REJECTED

    @ManyToOne
    @JoinColumn(name = "owner_id")
    private User owner;           // Who listed this property

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}