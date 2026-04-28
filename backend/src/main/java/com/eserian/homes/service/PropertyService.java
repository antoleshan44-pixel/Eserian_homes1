package com.eserian.homes.service;

import com.eserian.homes.dto.PropertyRequest;
import com.eserian.homes.model.Property;
import com.eserian.homes.model.User;
import com.eserian.homes.repository.PropertyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    // Owner creates a property (status = PENDING)
    public Property createProperty(PropertyRequest request, User owner) {
        Property property = new Property();
        property.setTitle(request.getTitle());
        property.setDescription(request.getDescription());
        property.setLocation(request.getLocation());
        property.setPricePerNight(request.getPricePerNight());
        property.setBedrooms(request.getBedrooms());
        property.setBathrooms(request.getBathrooms());
        property.setImageUrl(request.getImageUrl());
        property.setStatus("PENDING");  // Needs admin approval
        property.setOwner(owner);
        property.setCreatedAt(LocalDateTime.now());

        return propertyRepository.save(property);
    }

    // Get all APPROVED properties (for users to browse)
    public List<Property> getApprovedProperties() {
        return propertyRepository.findByStatus("APPROVED");
    }

    // Get properties by owner
    public List<Property> getPropertiesByOwner(User owner) {
        return propertyRepository.findByOwner(owner);
    }

    // Admin approves a property
    public Property approveProperty(Long propertyId) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        property.setStatus("APPROVED");
        property.setUpdatedAt(LocalDateTime.now());
        return propertyRepository.save(property);
    }

    // Search properties by location
    public List<Property> searchByLocation(String location) {
        return propertyRepository.findByLocationContainingIgnoreCase(location);
    }
}