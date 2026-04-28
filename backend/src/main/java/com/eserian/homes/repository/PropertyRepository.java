package com.eserian.homes.repository;

import com.eserian.homes.model.Property;
import com.eserian.homes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PropertyRepository extends JpaRepository<Property, Long> {
    // Find all properties owned by a specific user
    List<Property> findByOwner(User owner);

    // Find all APPROVED properties (for users to browse)
    List<Property> findByStatus(String status);

    // Search by location (case insensitive)
    List<Property> findByLocationContainingIgnoreCase(String location);
}