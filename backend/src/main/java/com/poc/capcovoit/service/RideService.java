package com.poc.capcovoit.service;

import com.poc.capcovoit.dto.DriverDTO;
import com.poc.capcovoit.dto.RideDTO;
import com.poc.capcovoit.entity.Ride;
import com.poc.capcovoit.entity.User;
import com.poc.capcovoit.dao.RideRepository;
import com.poc.capcovoit.dao.UserRepository;
import jakarta.transaction.Transactional;
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

    // ------------------------------------------------------
    // GET ALL RIDES (DTO)
    // ------------------------------------------------------
    public List<RideDTO> getAllRides(String currentUserEmail) {
        return rideRepository.findAll()
                .stream()
                .map(ride -> toDTO(ride, currentUserEmail))
                .toList();
    }

    // ------------------------------------------------------
    // GET MY RIDES (DTO)
    // ------------------------------------------------------
    public List<RideDTO> getRidesByDriver(String email) {
        return rideRepository.findByDriverEmail(email)
                .stream()
                .map(ride -> toDTO(ride, email))
                .toList();
    }

    @Transactional
    public Ride createRide(String start, String end, Integer seats, LocalDateTime date, String driverEmail) {

        User driver = userRepository.findByEmail(driverEmail)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        Ride ride = new Ride();
        ride.setStart(start);
        ride.setEnd(end);
        ride.setSeats(seats);
        ride.setDate(date);
        ride.setDriver(driver);

        // Inscription automatique du conducteur (sans consommer de place)
        ride.getParticipants().add(driver);

        return rideRepository.save(ride);
    }

    public void deleteRide(int id, String email) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"));

        if (!ride.getDriver().getEmail().equals(email)) {
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres trajets");
        }

        rideRepository.delete(ride);
    }

    @Transactional
    public void joinRide(int rideId, String email) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (ride.getParticipants().contains(user)) {
            return; // déjà inscrit
        }

        if (ride.getSeats() <= 0) {
            throw new RuntimeException("Plus de places disponibles");
        }

        ride.getParticipants().add(user);
        ride.setSeats(ride.getSeats() - 1);

        rideRepository.save(ride);
    }

    @Transactional
    public void leaveRide(int rideId, String email) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!ride.getParticipants().contains(user)) {
            return; // pas inscrit
        }

        // empêcher le driver de se désinscrire
        if (ride.getDriver().getEmail().equals(email)) {
            throw new RuntimeException("Le conducteur ne peut pas se désinscrire de son propre trajet");
        }

        ride.getParticipants().remove(user);
        ride.setSeats(ride.getSeats() + 1);

        rideRepository.save(ride);
    }

    public Optional<Ride> getRideById(int id) {
        return rideRepository.findById(id);
    }

    public RideDTO toDTO(Ride ride, String currentUserEmail) {

        RideDTO dto = new RideDTO();
        dto.id = ride.getId();
        dto.start = ride.getStart();
        dto.end = ride.getEnd();
        dto.date = ride.getDate();
        dto.seats = ride.getSeats();

        // driver
        DriverDTO driver = new DriverDTO();
        driver.email = ride.getDriver().getEmail();
        driver.firstName = ride.getDriver().getFirstName();
        driver.lastName = ride.getDriver().getLastName();
        dto.driver = driver;

        dto.isDriver = ride.getDriver().getEmail().equals(currentUserEmail);

        dto.joined = ride.getParticipants()
                .stream()
                .anyMatch(u -> u.getEmail().equals(currentUserEmail));

        return dto;
    }
}