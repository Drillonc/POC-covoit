package com.poc.capcovoit.dao;

import com.poc.capcovoit.entity.Ride;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface RideRepository extends JpaRepository<Ride, Integer> {
    List<Ride> findByDriverEmail(String driverEmail);
}