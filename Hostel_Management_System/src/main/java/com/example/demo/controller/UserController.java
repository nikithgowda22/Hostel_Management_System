// package com.example.demo.controller;

// import java.util.*;

// import com.example.demo.model.User;
// import com.example.demo.repository.UserRepository;
// import org.springframework.beans.factory.annotation.Autowired;
// import org.springframework.http.*;
// import org.springframework.web.bind.annotation.*;
// import org.springframework.web.client.RestTemplate;

// @RestController
// @RequestMapping("/api/users")
// @CrossOrigin(origins = "http://localhost:5173") // Adjust as needed
// public class UserController {

//     @Autowired
//     private UserRepository userRepository;

//     @PostMapping("/signup")
//     public ResponseEntity<?> signup(@RequestBody User user) {
//         if (userRepository.existsByEmail(user.getEmail())) {
//             return ResponseEntity.badRequest().body("{\"message\":\"Email already exists!\"}");
//         }

//         String token = UUID.randomUUID().toString();
//         user.setConfirmationToken(token);
//         user.setVerified(false);

//         userRepository.save(user);

//         // 🔔 Trigger n8n webhook for email
//         try {
//             RestTemplate restTemplate = new RestTemplate();

//             Map<String, String> body = new HashMap<>();
//             body.put("email", user.getEmail());
//             body.put("name", user.getName());
//             // 🔗 This confirmation link should point to your backend endpoint
//             body.put("confirmationLink", "http://localhost:8080/api/users/confirm/" + token);

//             HttpHeaders headers = new HttpHeaders();
//             headers.setContentType(MediaType.APPLICATION_JSON);
//             HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);

//             // ✅ YOUR ACTUAL N8N Webhook URL
//             String webhookUrl = "https://nikithgowda2.app.n8n.cloud/webhook/3356312c-4dab-44c1-8e92-174cca0dc6bd";
//             restTemplate.postForEntity(webhookUrl, request, String.class);
//         } catch (Exception e) {
//             return ResponseEntity.status(500).body("{\"message\":\"User saved, but email sending failed.\"}");
//         }

//         return ResponseEntity.ok("{\"message\":\"Signup successful. Please check your email to verify!\"}");
//     }

//     @GetMapping("/confirm/{token}")
//     public ResponseEntity<?> confirmEmail(@PathVariable String token) {
//         Optional<User> optionalUser = userRepository.findByConfirmationToken(token);

//         if (optionalUser.isEmpty()) {
//             return ResponseEntity.status(400).body("Invalid or expired token.");
//         }

//         User user = optionalUser.get();
//         user.setVerified(true);
//         user.setConfirmationToken(null);
//         userRepository.save(user);

//         return ResponseEntity.ok("✅ Email confirmed successfully!");
//     }

//     @PostMapping("/login")
//     public ResponseEntity<?> login(@RequestBody User user) {
//         Optional<User> existingUser = userRepository.findByEmailAndRole(user.getEmail(), user.getRole());

//         if (existingUser.isEmpty()) {
//             return ResponseEntity.status(401).body(Map.of("message", "Email or role is incorrect"));
//         }

//         User found = existingUser.get();

//         if (!found.getPassword().equals(user.getPassword())) {
//             return ResponseEntity.status(401).body(Map.of("message", "Incorrect password"));
//         }

//         if (!found.isVerified()) {
//             return ResponseEntity.status(403).body(Map.of("message", "Please verify your email before logging in"));
//         }

//         // ✅ Return user info to frontend
//         Map<String, Object> response = new HashMap<>();
//         response.put("message", "Login successful!");
//         response.put("user", Map.of(
//                 "name", found.getName(),
//                 "email", found.getEmail(),
//                 "role", found.getRole()
//         ));

//         return ResponseEntity.ok(response);
//     }

// }
package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173") // Adjust to match your frontend
public class UserController {

    @Autowired
    private UserRepository userRepository;

    // ✅ Handles root URL to prevent 404
    @GetMapping("/")
    public ResponseEntity<String> home() {
        return ResponseEntity.ok("✅ Backend is running. Use /api/users/* endpoints.");
    }

    // ✅ Basic health check
    @GetMapping("/api/users")
    public ResponseEntity<String> status() {
        return ResponseEntity.ok("User API is up and running!");
    }

    @PostMapping("/api/users/signup")
    public ResponseEntity<?> signup(@RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Email already exists!"));
        }

        String token = UUID.randomUUID().toString();
        user.setConfirmationToken(token);
        user.setVerified(false);
        userRepository.save(user);

        try {
            RestTemplate restTemplate = new RestTemplate();
            Map<String, String> body = Map.of(
                "email", user.getEmail(),
                "name", user.getName(),
                "confirmationLink", "http://localhost:8080/api/users/confirm/" + token
            );

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
// String webhookUrl = "https://nikith2.app.n8n.cloud/webhook-test/3356312c-4dab-44c1-8e92-174cca0dc6bd";

            String webhookUrl = "https://nikith2.app.n8n.cloud/webhook/3356312c-4dab-44c1-8e92-174cca0dc6bd";
            restTemplate.postForEntity(webhookUrl, request, String.class);
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of("message", "User saved, but email sending failed."));
        }

        return ResponseEntity.ok(Map.of("message", "Signup successful. Please check your email to verify!"));
    }

    @GetMapping("/api/users/confirm/{token}")
    public ResponseEntity<?> confirmEmail(@PathVariable String token) {
        Optional<User> optionalUser = userRepository.findByConfirmationToken(token);
        if (optionalUser.isEmpty()) {
            return ResponseEntity.status(400).body("Invalid or expired token.");
        }

        User user = optionalUser.get();
        user.setVerified(true);
        user.setConfirmationToken(null);
        userRepository.save(user);

        return ResponseEntity.ok("✅ Email confirmed successfully!");
    }

    @PostMapping("/api/users/login")
    public ResponseEntity<?> login(@RequestBody User user) {
        Optional<User> existingUser = userRepository.findByEmailAndRole(user.getEmail(), user.getRole());
        if (existingUser.isEmpty()) {
            return ResponseEntity.status(401).body(Map.of("message", "Email or role is incorrect"));
        }

        User found = existingUser.get();

        if (!found.getPassword().equals(user.getPassword())) {
            return ResponseEntity.status(401).body(Map.of("message", "Incorrect password"));
        }

        if (!found.isVerified()) {
            return ResponseEntity.status(403).body(Map.of("message", "Please verify your email before logging in"));
        }

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful!");
        response.put("user", Map.of(
            "name", found.getName(),
            "email", found.getEmail(),
            "role", found.getRole()
        ));

        return ResponseEntity.ok(response);
    }
}
