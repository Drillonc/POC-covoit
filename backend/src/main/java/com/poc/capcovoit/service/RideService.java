package com.poc.capcovoit.service;

import com.poc.capcovoit.dao.RideRepository;
import com.poc.capcovoit.dao.UserRepository;
import com.poc.capcovoit.entity.Ride;
import com.poc.capcovoit.entity.User;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideService(RideRepository rideRepository, UserRepository userRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    public List<Ride> getAllRides() {
        return rideRepository.findAll();
    }

    public List<Ride> getRidesByDriver(String driverEmail) {
        return rideRepository.findByDriverEmail(driverEmail);
    }

    public Optional<Ride> getRideById(Long id) {
        return rideRepository.findById(id);
    }

    public Ride createRide(String start, String end, Integer seats, LocalDateTime date, String driverEmail) {
        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Driver not found"));
        Ride ride = new Ride(start, end, seats, date, driver);
        return rideRepository.save(ride);
    }

    public void deleteRide(Long id, String driverEmail) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Ride not found"));
        if (!ride.getDriver().getEmail().equals(driverEmail)) {
            throw new RuntimeException("Not authorized to delete this ride");
        }
        rideRepository.delete(ride);
    }
}