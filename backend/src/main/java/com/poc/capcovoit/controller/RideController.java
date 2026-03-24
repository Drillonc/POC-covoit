package com.poc.capcovoit.controller;

import com.poc.capcovoit.entity.Ride;
import com.poc.capcovoit.service.RideService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.HashMap;

@RestController
@RequestMapping("/api/rides")
public class RideController {

    private final RideService rideService;

    public RideController(RideService rideService) {
        this.rideService = rideService;
    }

    @GetMapping()
    public ResponseEntity<List<Ride>> getAllRides() {
        List<Ride> rides = rideService.getAllRides();
        return ResponseEntity.ok(rides);
    }

    @GetMapping("/my")
    public ResponseEntity<List<Ride>> getMyRides(Authentication authentication) {
        String driverEmail = authentication.getName();
        List<Ride> rides = rideService.getRidesByDriver(driverEmail);
        return ResponseEntity.ok(rides);
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createRide(
            @RequestBody CreateRideRequest request,
            Authentication authentication) {
        String driverEmail = authentication.getName();
        try {
            Ride ride = rideService.createRide(
                request.start,
                request.end,
                request.seats,
                LocalDateTime.parse(request.date),
                driverEmail
            );
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("ride", ride);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> deleteRide(
            @PathVariable Long id,
            Authentication authentication) {
        String driverEmail = authentication.getName();
        try {
            rideService.deleteRide(id, driverEmail);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }

    public static class CreateRideRequest {
        public String start;
        public String end;
        public Integer seats;
        public String date; // ISO format: YYYY-MM-DD
    }
}