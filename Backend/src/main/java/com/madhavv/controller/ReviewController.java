package com.madhavv.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.madhavv.dto.AddReviewRequest;
import com.madhavv.dto.CommonApiResponse;
import com.madhavv.dto.FoodReviewResponseDto;
import com.madhavv.resource.ReviewResource;

import io.swagger.v3.oas.annotations.Operation;

@RestController
@RequestMapping("api/food/review")
@CrossOrigin(origins = "http://localhost:3000")
public class ReviewController {
	
	@Autowired
	private ReviewResource reviewResource;
	
	@PostMapping("add")
	@Operation(summary = "Api to add food review")
	public ResponseEntity<CommonApiResponse> addFoodReview(@RequestBody AddReviewRequest review) {
		return this.reviewResource.addReview(review);
	}
	
	@GetMapping("fetch")
	@Operation(summary = "Api to fetch food reviews")
	public ResponseEntity<FoodReviewResponseDto> fetchFoodReview(@RequestParam("foodId") int foodReview) {
		return this.reviewResource.fetchFoodReviews(foodReview);
	}
	
	@GetMapping("restaurant")
	@Operation(summary = "Api to fetch restaurant food review")
	public ResponseEntity<FoodReviewResponseDto> fetchRestaurantReviews(@RequestParam("restaurantId") int restaurantId) {
		return this.reviewResource.fetchRestaurantFoodReviews(restaurantId);
	}

}
