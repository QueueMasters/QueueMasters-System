package com.queuemaster.backend.Controllers;

import com.queuemaster.backend.Services.AppUser;
import com.queuemaster.backend.Repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private AppUserRepository userRepository;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody AppUser newUser) {
        if (userRepository.findByUsername(newUser.getUsername()).isPresent()) {
            return ResponseEntity.badRequest().body("Username already exists!");
        }

        AppUser savedUser = userRepository.save(newUser);
        return ResponseEntity.ok(savedUser);
    }


    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AppUser loginRequest) {
        AppUser user = userRepository.findByUsername(loginRequest.getUsername())
                .orElse(null);

        if (user != null && user.getPassword().equals(loginRequest.getPassword())) {

            return ResponseEntity.ok(user);
        }

        return ResponseEntity.status(401).body("Invalid credentials");
    }
}