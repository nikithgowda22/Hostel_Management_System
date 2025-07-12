package com.example.demo.controller;

import com.razorpay.Order;
import com.razorpay.RazorpayClient;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import com.example.demo.model.StudentRegistration;
import com.example.demo.repository.StudentRegistrationRepository;

import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/payment")
public class PaymentController {

    @Autowired
    private StudentRegistrationRepository studentRepository;

    @PostMapping("/create-order")
    public String createOrder(@RequestBody Map<String, Object> data) {
        try {
            int amount = (int) data.get("amount");

            RazorpayClient razorpay = new RazorpayClient("rzp_test_l3WNLIY1GCzUyR", "HKyZ0I4v1E23LzISHDtUTsJx");

            JSONObject options = new JSONObject();
            options.put("amount", amount);
            options.put("currency", "INR");
            options.put("receipt", "order_rcptid_" + System.currentTimeMillis());

            Order order = razorpay.orders.create(options);
            return order.toString();

        } catch (Exception e) {
            e.printStackTrace();
            return "Error creating Razorpay order";
        }
    }

    @PostMapping("/verify-payment")
    public ResponseEntity<String> verifyPayment(@RequestBody Map<String, String> payload) {
        try {
            String paymentId = payload.get("paymentId");
            String email = payload.get("email");

            Optional<StudentRegistration> optionalStudent = studentRepository.findByEmail(email);
            if (optionalStudent.isPresent()) {
                StudentRegistration student = optionalStudent.get();
                student.setPaymentStatus("Paid");
                student.setPaymentId(paymentId);
                studentRepository.save(student);
                return ResponseEntity.ok("✅ Payment recorded successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ Student not found.");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("❌ Error recording payment.");
        }
    }
}
