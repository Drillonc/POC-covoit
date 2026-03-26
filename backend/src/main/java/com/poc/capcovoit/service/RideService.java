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
import java.util.stream.Stream;

/*
 * Nom de classe : RideService
 *
 * Description   : Cette classe fournit les services liés aux trajets, tels que la création, la suppression, l'inscription et la désinscription des trajets, ainsi que la conversion des entités Ride en DTO pour les réponses API.
 *
 */
@Service
public class RideService {

    private final RideRepository rideRepository;
    private final UserRepository userRepository;

    public RideService(RideRepository rideRepository, UserRepository userRepository) {
        this.rideRepository = rideRepository;
        this.userRepository = userRepository;
    }

    // Méthode pour récupérer tous les trajets, en convertissant les entités Ride en DTO pour inclure les informations du conducteur et des passagers
    public List<RideDTO> getAllRides(String currentUserEmail) {
        return rideRepository.findAll()
                .stream()
                .filter(ride -> ride.getDate().isAfter(LocalDateTime.now()))
                .map(ride -> toDTO(ride, currentUserEmail))
                .toList();
    }

    // Méthode pour récupérer les trajets d'un conducteur spécifique, en utilisant l'email du conducteur pour filtrer les trajets
    public List<RideDTO> getRidesByDriver(String email) {
        return rideRepository.findByDriverEmail(email)
                .stream()
                .filter(ride -> ride.getDate().isAfter(LocalDateTime.now()))
                .map(ride -> toDTO(ride, email))
                .toList();
    }

    // Méthode pour récupérer les trajets passés d'un conducteur spécifique, en utilisant l'email du conducteur pour filtrer les trajets
    public List<RideDTO> getPassedRidesByUser(String email) {
        Stream<Ride> passedMydrive = rideRepository.findByDriverEmail(email)
                .stream();

        Stream<Ride> passedJoined = rideRepository.findByParticipantEmail(email)
                .stream();

        List<RideDTO> passedDTO = Stream.concat(passedMydrive, passedJoined)
                .filter(ride -> ride.getDate().isBefore(LocalDateTime.now()))
                .map(ride -> toDTO(ride, email))
                .toList() ;

        return passedDTO;
    }

    // Méthode pour créer un nouveau trajet en associant le conducteur à partir de son email et en sauvegardant le trajet dans la base de données
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

    // Méthode pour supprimer un trajet en vérifiant que l'utilisateur qui effectue la suppression est bien le conducteur du trajet
    public void deleteRide(int id, String email) {
        Ride ride = rideRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"));

        if (!ride.getDriver().getEmail().equals(email)) {
            throw new RuntimeException("Vous ne pouvez supprimer que vos propres trajets");
        }

        rideRepository.delete(ride);
    }

    // Méthode pour permettre à un utilisateur de s'inscrire à un trajet en vérifiant la disponibilité des places et en mettant à jour la liste des participants et le nombre de places restantes
    @Transactional
    public void joinRide(int rideId, String email) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (ride.getParticipants().contains(user)) {
            return;
        }

        if (ride.getSeats() <= 0) {
            throw new RuntimeException("Plus de places disponibles");
        }

        ride.getParticipants().add(user);
        ride.setSeats(ride.getSeats() - 1);

        rideRepository.save(ride);
    }

    // Méthode pour permettre à un utilisateur de se désinscrire d'un trajet en vérifiant que l'utilisateur est bien inscrit au trajet et qu'il n'est pas le conducteur, puis en mettant à jour la liste des participants et le nombre de places restantes
    @Transactional
    public void leaveRide(int rideId, String email) {
        Ride ride = rideRepository.findById(rideId)
                .orElseThrow(() -> new RuntimeException("Trajet introuvable"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable"));

        if (!ride.getParticipants().contains(user)) {
            return;
        }

        // Un conducteur ne peut pas se désinscrire de son propre trajet
        if (ride.getDriver().getEmail().equals(email)) {
            throw new RuntimeException("Le conducteur ne peut pas se désinscrire de son propre trajet");
        }

        ride.getParticipants().remove(user);
        ride.setSeats(ride.getSeats() + 1);

        rideRepository.save(ride);
    }

    // Méthode pour récupérer un trajet par son ID, utilisée notamment pour afficher les détails d'un trajet ou la liste de ses participants
    public Optional<Ride> getRideById(int id) {
        return rideRepository.findById(id);
    }

    // Méthode pour convertir une entité Ride en DTO RideDTO, en incluant les informations du conducteur, des passagers et l'état d'inscription de l'utilisateur courant
    public RideDTO toDTO(Ride ride, String currentUserEmail) {
        // Création d'un DTO pour le trajet en copiant les propriétés de base
        RideDTO dto = new RideDTO();
        dto.id = ride.getId();
        dto.start = ride.getStart();
        dto.end = ride.getEnd();
        dto.date = ride.getDate();
        dto.seats = ride.getSeats();

        // Création d'un DTO pour le conducteur en copiant les informations de l'entité User associée au conducteur du trajet
        User modelDriver = ride.getDriver();
        UserDTO driver = new UserDTO();
        driver.email = modelDriver.getEmail();
        driver.firstName = modelDriver.getFirstName();
        driver.lastName = modelDriver.getLastName();
        dto.driver = driver;

        // Booléen pour savoir si l'utilisateur courant est le conducteur du trajet
        dto.isDriver = modelDriver.getEmail().equals(currentUserEmail);

        // Création d'une liste de DTO pour les passagers du trajet
        List<User> modelPassengers = ride.getParticipants();
        dto.passengers = modelPassengers
                .stream()
                .map(u -> {
                    UserDTO p = new UserDTO();
                    p.email = u.getEmail();
                    p.firstName = u.getFirstName();
                    p.lastName = u.getLastName();
                    return p;
                })
                .toList();

        // Booléen pour savoir si le trajet est passé ou à venir en comparant la date du trajet avec la date actuelle
        dto.isPassed = ride.getDate().isBefore(LocalDateTime.now());
        
        // Booléen pour savoir si l'utilisateur courant est inscrit au trajet en tant que passager
        dto.joined = modelPassengers
                .stream()
                .anyMatch(u -> u.getEmail().equals(currentUserEmail));

        return dto;
    }

    // Méthode pour récupérer les trajets auxquels un utilisateur est inscrit
    public List<RideDTO> getRidesByParticipant(String email) {
        return rideRepository.findByParticipantEmail(email)
                .stream()
                .filter(ride -> ride.getDate().isAfter(LocalDateTime.now()))
                .map(ride -> toDTO(ride, email))
                .toList();
    }
}