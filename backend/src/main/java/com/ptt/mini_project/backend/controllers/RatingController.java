package com.ptt.mini_project.backend.controllers;

import com.ptt.mini_project.backend.entities.Rating;
import com.ptt.mini_project.backend.services.RatingService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rating")
@RequiredArgsConstructor
public class RatingController {

    private final RatingService reviewService;

    @PostMapping("/postRating")
    public ResponseEntity<Void> postRating(@RequestBody Rating rating) {
        reviewService.postReview(rating);
        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping("/getAllRatings")
    public ResponseEntity<List<Rating>> getAllRatings() {
        return ResponseEntity.ok(reviewService.getAllRatings());
    }

    @GetMapping("/getStars")
    public ResponseEntity<Double> getStars() {
        return ResponseEntity.ok(reviewService.getStars());
    }

}
