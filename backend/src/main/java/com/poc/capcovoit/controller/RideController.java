package com.poc.capcovoit.controller;

import com.poc.capcovoit.dto.RideDTO;
import com.poc.capcovoit.entity.User;
import com.poc.capcovoit.security.CustomUserDetails;
import com.poc.capcovoit.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

/*
 * Nom de classe : RideController
 *
 * Description   : Ce contrôleur gère les opérations liées aux trajets. Il créer des endpoints pour créer, consulter, modifier et supprimer des trajets.
 *
 */
@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    // Endpoint pour récupérer tous les trajets
    @GetMapping
    public ResponseEntity<List<RideDTO>> getAllRides(@AuthenticationPrincipal CustomUserDetails user) {
        String email = user.getUsername();
        List<RideDTO> rides = rideService.getAllRides(email);

        return ResponseEntity.ok(rides);
    }

    // Endpoint pour récupérer les trajets d'un conducteur
    @GetMapping("/my")
    public ResponseEntity<List<RideDTO>> getMyRides(@AuthenticationPrincipal CustomUserDetails user) {
        String email = user.getUsername();
        List<RideDTO> rides = rideService.getRidesByDriver(email);

        return ResponseEntity.ok(rides);
    }

    // Endpoint pour récupérer les trajets auxquels un utilisateur est inscrit
    @GetMapping("/joined")
    public ResponseEntity<List<RideDTO>> getJoinedRides(@AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();
        List<RideDTO> rides = rideService.getRidesByParticipant(email);

        return ResponseEntity.ok(rides);
    }

    // Endpoint pour récupérer les trajets auxquels un utilisateur a participé et qui sont passés
    @GetMapping("/passed")
    public ResponseEntity<List<RideDTO>> getPassedRides(@AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();
        List<RideDTO> rides = rideService.getPassedRidesByUser(email);

        return ResponseEntity.ok(rides);
    } 

    // Endpoint pour créer un nouveau trajet
    @PostMapping
    public ResponseEntity<RideDTO> createRide(@RequestBody CreateRideRequest request, @AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();

        var ride = rideService.createRide(
                request.start,
                request.end,
                request.seats,
                LocalDateTime.parse(request.date),
                email
        );

        RideDTO dto = rideService.toDTO(ride, email);

        return ResponseEntity.ok(dto);
    }

    // Endpoint pour supprimer un trajet
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRide(@PathVariable int id, @AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();
        rideService.deleteRide(id, email);

        return ResponseEntity.ok().build();
    }

    // Endpoint pour rejoindre un trajet
    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinRide(@PathVariable int id, @AuthenticationPrincipal CustomUserDetails user) {

        rideService.joinRide(id, user.getUsername());
        return ResponseEntity.ok().build();
    }

    // Endpoint pour quitter un trajet
    @DeleteMapping("/{id}/join")
    public ResponseEntity<?> leaveRide(@PathVariable int id, @AuthenticationPrincipal CustomUserDetails user) {

        rideService.leaveRide(id, user.getUsername());
        return ResponseEntity.ok().build();
    }

    // Endpoint pour récupérer les participants d'un trajet
    @GetMapping("/{id}/participants")
    public List<User> getParticipants(@PathVariable int id) {
        return rideService.getRideById(id)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"))
                .getParticipants();
    }

    // Classe interne pour la requête de création de trajet
    public static class CreateRideRequest {
        public String start;
        public String end;
        public Integer seats;
        public String date;
    }
}