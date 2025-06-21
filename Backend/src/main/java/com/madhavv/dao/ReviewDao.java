package com.madhavv.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.madhavv.entity.Food;
import com.madhavv.entity.Review;
import com.madhavv.entity.User;

@Repository
public interface ReviewDao extends JpaRepository<Review, Integer> {
	
	List<Review> findByFoodIn(List<Food> foods);
	
	@Query("SELECT r FROM Review r WHERE r.food.restaurant = :restaurant")
	List<Review> findAllOrdersByRestaurant(@Param("restaurant") User restaurant);

}
