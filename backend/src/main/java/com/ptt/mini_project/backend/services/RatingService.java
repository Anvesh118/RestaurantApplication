package com.ptt.mini_project.backend.services;

import com.ptt.mini_project.backend.entities.Rating;
import com.ptt.mini_project.backend.repositories.RatingRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class RatingService {
    private final RatingRepository reviewsRepository;


    public void postReview(Rating rating) {
        reviewsRepository.save(rating);
    }

    public List<Rating> getAllRatings() {
        return reviewsRepository.findAll();
    }

    public Double getStars() {
        Double totalRatings = reviewsRepository.findSumOfAllRatings();
        Long totalReviews = reviewsRepository.count();

        if(totalReviews == 0) return 0.0;

        Double averageStars = totalRatings / totalReviews;
        return  averageStars;
    }
}
