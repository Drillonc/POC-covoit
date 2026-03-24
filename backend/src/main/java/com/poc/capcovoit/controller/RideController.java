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

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping
    public ResponseEntity<List<RideDTO>> getAllRides(
            @AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();
        List<RideDTO> rides = rideService.getAllRides(email);

        return ResponseEntity.ok(rides);
    }

    @GetMapping("/my")
    public ResponseEntity<List<RideDTO>> getMyRides(
            @AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();
        List<RideDTO> rides = rideService.getRidesByDriver(email);

        return ResponseEntity.ok(rides);
    }

    @PostMapping
    public ResponseEntity<RideDTO> createRide(
            @RequestBody CreateRideRequest request,
            @AuthenticationPrincipal CustomUserDetails user) {

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

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteRide(
            @PathVariable int id,
            @AuthenticationPrincipal CustomUserDetails user) {

        String email = user.getUsername();
        rideService.deleteRide(id, email);

        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinRide(
            @PathVariable int id,
            @AuthenticationPrincipal CustomUserDetails user) {

        rideService.joinRide(id, user.getUsername());
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/join")
    public ResponseEntity<?> leaveRide(
            @PathVariable int id,
            @AuthenticationPrincipal CustomUserDetails user) {

        rideService.leaveRide(id, user.getUsername());
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{id}/participants")
    public List<User> getParticipants(@PathVariable int id) {
        return rideService.getRideById(id)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"))
                .getParticipants();
    }


    public static class CreateRideRequest {
        public String start;
        public String end;
        public Integer seats;
        public String date;
    }
}