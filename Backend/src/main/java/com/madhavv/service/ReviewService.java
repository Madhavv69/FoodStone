package com.madhavv.service;

import java.util.List;

import com.madhavv.entity.Food;
import com.madhavv.entity.Review;
import com.madhavv.entity.User;

public interface ReviewService {
	
	Review addReview(Review review);
	
	List<Review> fetchFoodReviews(List<Food> products);

	List<Review> fetchRestaurantFoodReview(User restaurant);
	
}
