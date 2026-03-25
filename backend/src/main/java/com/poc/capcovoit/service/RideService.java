package com.poc.capcovoit.service;

import com.poc.capcovoit.dto.RideDTO;
import com.poc.capcovoit.dto.UserDTO;
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

    public List<RideDTO> getAllRides(String currentUserEmail) {
        return rideRepository.findAll()
                .stream()
                .map(ride -> toDTO(ride, currentUserEmail))
                .toList();
    }


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

        User modelDriver = ride.getDriver();
        UserDTO driver = new UserDTO();
        driver.email = modelDriver.getEmail();
        driver.firstName = modelDriver.getFirstName();
        driver.lastName = modelDriver.getLastName();
        dto.driver = driver;

        dto.isDriver = modelDriver.getEmail().equals(currentUserEmail);

        List<User> modelPassengers = ride.getParticipants();
        dto.passengers = modelPassengers
                .stream()
                .filter(u -> !u.getEmail().equals(modelDriver.getEmail())) // exclure le driver
                .map(u -> {
                    UserDTO p = new UserDTO();
                    p.email = u.getEmail();
                    p.firstName = u.getFirstName();
                    p.lastName = u.getLastName();
                    return p;
                })
                .toList();
        dto.joined = modelPassengers
                .stream()
                .anyMatch(u -> u.getEmail().equals(currentUserEmail));

        return dto;
    }

    public List<RideDTO> getRidesByParticipant(String email) {
        return rideRepository.findByParticipantEmail(email)
                .stream()
                .map(ride -> toDTO(ride, email))
                .toList();
    }
}