package com.madhavv.resource;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.madhavv.dto.CartRequestDto;
import com.madhavv.dto.CartResponseDto;
import com.madhavv.dto.CommonApiResponse;
import com.madhavv.entity.Cart;
import com.madhavv.entity.Food;
import com.madhavv.entity.User;
import com.madhavv.exception.CartSaveFailedException;
import com.madhavv.service.CartService;
import com.madhavv.service.FoodService;
import com.madhavv.service.UserService;

import jakarta.transaction.Transactional;

@Component
@Transactional
public class CartResource {

	private final Logger LOG = LoggerFactory.getLogger(CartResource.class);

	@Autowired
	private CartService cartService;

	@Autowired
	private UserService userService;

	@Autowired
	private FoodService foodService;

	public ResponseEntity<CommonApiResponse> addToCart(CartRequestDto request) {

		LOG.info("Request received for add to cart");

		CommonApiResponse response = new CommonApiResponse();

		if (request == null || request.getUserId() == 0 || request.getFoodId() == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(request.getUserId());

		if (user == null) {
			response.setResponseMessage("Failed to add to cart, Customer not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Food food = this.foodService.getFoodById(request.getFoodId());

		if (food == null) {
			response.setResponseMessage("Failed to add to cart, Food not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		Cart cart = new Cart();
		cart.setUser(user);
		cart.setFood(food);
		cart.setQuantity(request.getQuantity());
		cart.setAddedTime(
				String.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli()));

		Cart savedCart = this.cartService.updateCart(cart);

		if (savedCart == null) {
			throw new CartSaveFailedException("Failed to add to Cart");
		}

		response.setResponseMessage("Food Added to Cart Successful");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<CartResponseDto> updateCart(CartRequestDto request) {

		LOG.info("Request received for updating the cart");

		CartResponseDto response = new CartResponseDto();

		if (request == null || request.getId() == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(request.getUserId());

		if (user == null) {
			response.setResponseMessage("Unauthorized User to update the Cart");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Cart cart = this.cartService.getCartById(request.getId());

		if (cart == null) {
			response.setResponseMessage("Cart not found:(");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		try {
			if (request.getQuantity() == 0) {
				this.cartService.deleteCart(cart);
			} else {
				cart.setQuantity(request.getQuantity());

				this.cartService.updateCart(cart);
			}
		} catch (Exception e) {
			throw new CartSaveFailedException("Failed to update the Cart");
		}

		response.setResponseMessage("User Cart Updated Successful");
		response.setSuccess(true);

		return new ResponseEntity<CartResponseDto>(response, HttpStatus.OK);

	}

	public ResponseEntity<CartResponseDto> deleteCart(CartRequestDto request) {

		LOG.info("Request received for deleting the cart");

		CartResponseDto response = new CartResponseDto();

		if (request.getId() == 0) {
			response.setResponseMessage("cart id is missing");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(request.getUserId());

		if (user == null) {
			response.setResponseMessage("Unauthorized User to delete the Cart");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		Cart cart = this.cartService.getCartById(request.getId());

		if (cart == null) {
			response.setResponseMessage("Cart not found");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		try {
			this.cartService.deleteCart(cart);
		} catch (Exception e) {
			throw new CartSaveFailedException("Failed to delete the Cart");
		}

		response.setResponseMessage("User Cart Updated Successful");
		response.setSuccess(true);

		return new ResponseEntity<CartResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<CartResponseDto> fetchUserCartDetails(int userId) {

		LOG.info("Request received for fetching the user cart");

		CartResponseDto response = new CartResponseDto();

		User user = this.userService.getUserById(userId);

		if (user == null) {
			response.setResponseMessage("Unauthorized User to fetch the Cart");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Cart> carts = new ArrayList<>();

		carts = this.cartService.findByUser(user);

		if (carts == null) {
			response.setResponseMessage("No Foods found in Cart");
			response.setSuccess(false);

			return new ResponseEntity<CartResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		response.setTotalCartAmount(calulateTotalAmountFromCart(carts));
		response.setCarts(carts);
		response.setResponseMessage("User Cart Fetched Successful");
		response.setSuccess(true);

		return new ResponseEntity<CartResponseDto>(response, HttpStatus.OK);
	}

	private BigDecimal calulateTotalAmountFromCart(List<Cart> carts) {

		BigDecimal totalAmount = BigDecimal.ZERO;

		if (CollectionUtils.isEmpty(carts)) {
			return totalAmount;
		}

		for (Cart cart : carts) {

			BigDecimal cartAmount = cart.getFood().getPrice().multiply(new BigDecimal(cart.getQuantity()));

			totalAmount = totalAmount.add(cartAmount);
		}

		return totalAmount;
	}

}
