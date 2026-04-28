package com.eserian.homes.dto;

import lombok.*;
import java.time.LocalDate;

@Getter
@Setter
public class PropertyRequest {
    private String title;
    private String description;
    private String location;
    private Double pricePerNight;
    private Integer bedrooms;
    private Integer bathrooms;
    private String imageUrl;
}