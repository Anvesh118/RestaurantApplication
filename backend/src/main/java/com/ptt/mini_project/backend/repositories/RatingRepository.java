package com.ptt.mini_project.backend.repositories;

import com.ptt.mini_project.backend.entities.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {

    @Query("SELECT COALESCE(SUM(r.rating), 0) FROM Rating r")
    Double findSumOfAllRatings();
}
