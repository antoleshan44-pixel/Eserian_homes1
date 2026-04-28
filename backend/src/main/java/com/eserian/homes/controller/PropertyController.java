package com.eserian.homes.controller;

import com.eserian.homes.dto.PropertyRequest;
import com.eserian.homes.model.Property;
import com.eserian.homes.model.User;
import com.eserian.homes.repository.UserRepository;
import com.eserian.homes.service.PropertyService;
import com.eserian.homes.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@RequestMapping("/api/properties")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // Helper to get current user from token
    private User getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        String token = authHeader.substring(7);
        String email = jwtUtil.extractEmail(token);
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    // OWNER: Create new property
    @PostMapping
    public ResponseEntity<?> createProperty(@RequestBody PropertyRequest request,
                                            HttpServletRequest httpRequest) {
        try {
            User owner = getCurrentUser(httpRequest);
            Property property = propertyService.createProperty(request, owner);
            return ResponseEntity.ok("Property created! Waiting for admin approval.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // EVERYONE: View all approved properties
    @GetMapping("/approved")
    public ResponseEntity<List<Property>> getApprovedProperties() {
        return ResponseEntity.ok(propertyService.getApprovedProperties());
    }

    // OWNER: View my properties
    @GetMapping("/my-properties")
    public ResponseEntity<List<Property>> getMyProperties(HttpServletRequest request) {
        User owner = getCurrentUser(request);
        return ResponseEntity.ok(propertyService.getPropertiesByOwner(owner));
    }

    // ADMIN: Approve a property
    @PutMapping("/{propertyId}/approve")
    public ResponseEntity<?> approveProperty(@PathVariable Long propertyId) {
        try {
            propertyService.approveProperty(propertyId);
            return ResponseEntity.ok("Property approved!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // Search properties
    @GetMapping("/search")
    public ResponseEntity<List<Property>> search(@RequestParam String location) {
        return ResponseEntity.ok(propertyService.searchByLocation(location));
    }
}