package com.eserian.homes.repository;

import com.eserian.homes.model.Booking;
import com.eserian.homes.model.Property;
import com.eserian.homes.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import java.time.LocalDate;
import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    // Find bookings for a user
    List<Booking> findByUser(User user);

    // Find bookings for a property
    List<Booking> findByProperty(Property property);

    // Check if dates are already booked (prevents double booking)
    @Query("SELECT b FROM Booking b WHERE b.property = ?1 AND b.status != 'CANCELLED' " +
            "AND ((b.checkInDate BETWEEN ?2 AND ?3) OR (b.checkOutDate BETWEEN ?2 AND ?3) " +
            "OR (?2 BETWEEN b.checkInDate AND b.checkOutDate))")
    List<Booking> findConflictingBookings(Property property, LocalDate checkIn, LocalDate checkOut);
}