package com.example.demo.controller;

import com.example.demo.model.Room;
import com.example.demo.repository.RoomRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
@CrossOrigin(origins = "*") // Allow all cross-origin requests (frontend/backend communication)
public class RoomController {

    @Autowired
    private RoomRepository roomRepository;

    // Add a new room
    @PostMapping
    public ResponseEntity<Room> addRoom(@RequestBody Room room) {
        Room savedRoom = roomRepository.save(room);
        return ResponseEntity.ok(savedRoom);
    }

    // Get all rooms
    @GetMapping
    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }
    @DeleteMapping("/{roomNo}")
public ResponseEntity<?> deleteRoom(@PathVariable String roomNo) {
    Room room = roomRepository.findByRoomNo(roomNo);
    if (room == null) {
        return ResponseEntity.status(404).body(Map.of("message", "Room not found"));
    }

    roomRepository.delete(room);
    return ResponseEntity.ok(Map.of("message", "Room deleted successfully"));
}

}
