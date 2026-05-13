package com.queuemaster.backend.Controllers;

import com.queuemaster.backend.Services.AppUser;
import com.queuemaster.backend.Repositories.AppUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private AppUserRepository appUserRepository;

    @PostMapping("/signup")
    public AppUser registerUser(@RequestBody AppUser newUser) {
        return appUserRepository.save(newUser);
    }

    @PostMapping("/login")
    public AppUser loginUser(@RequestBody AppUser loginRequest) {
        Optional<AppUser> existingUser = appUserRepository.findByUsername(loginRequest.getUsername());
        if (existingUser.isPresent() && existingUser.get().getPassword().equals(loginRequest.getPassword())) {
            return existingUser.get();
        }
        throw new RuntimeException("Invalid credentials");
    }

    @PutMapping("/{id}")
    public AppUser updateUser(@PathVariable Long id, @RequestBody AppUser updatedUserDetails) {
        return appUserRepository.findById(id)
                .map(user -> {
                    user.setUsername(updatedUserDetails.getUsername());
                    user.setRole(updatedUserDetails.getRole());
                    return appUserRepository.save(user);
                })
                .orElseThrow(() -> new RuntimeException("User not found with id " + id));
    }

    @GetMapping
    public List<AppUser> getAllUsers() {
        return appUserRepository.findAll();
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        appUserRepository.deleteById(id);
    }
}