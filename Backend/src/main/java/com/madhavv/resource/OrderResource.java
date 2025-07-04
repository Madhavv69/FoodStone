package com.madhavv.resource;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.util.CollectionUtils;

import com.madhavv.dto.CommonApiResponse;
import com.madhavv.dto.OrderResponseDto;
import com.madhavv.dto.UpdateDeliveryStatusRequest;
import com.madhavv.entity.Cart;
import com.madhavv.entity.Orders;
import com.madhavv.entity.User;
import com.madhavv.exception.OrderSaveFailedException;
import com.madhavv.service.CartService;
import com.madhavv.service.OrderService;
import com.madhavv.service.UserService;
import com.madhavv.utility.Constants.DeliveryStatus;
import com.madhavv.utility.Constants.DeliveryTime;
import com.madhavv.utility.Helper;

import jakarta.transaction.Transactional;

@Component
@Transactional
public class OrderResource {

	private final Logger LOG = LoggerFactory.getLogger(CartResource.class);

	@Autowired
	private CartService cartService;

	@Autowired
	private UserService userService;

	@Autowired
	private OrderService orderService;

	public ResponseEntity<CommonApiResponse> orderFoodsFromCart(int userId) {

		LOG.info("Request received for ordering the foods from the Cart");

		CommonApiResponse response = new CommonApiResponse();

		if (userId == 0) {
			response.setResponseMessage("user id missing");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(userId);

		if (user == null) {
			response.setResponseMessage("User not found");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		List<Cart> carts = this.cartService.findByUser(user);

		if (CollectionUtils.isEmpty(carts)) {
			response.setResponseMessage("No foods found in Cart");
			response.setSuccess(false);

			return new ResponseEntity<CommonApiResponse>(response, HttpStatus.BAD_REQUEST);
		}

		String orderTime = String
				.valueOf(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant().toEpochMilli());

		// Create a map to group cart items by seller
		Map<User, List<Cart>> cartItemsBySeller = new HashMap<>();

		for (Cart cart : carts) {
			User restaurant = cart.getFood().getRestaurant();

			// Check if the seller is already in the map
			if (!cartItemsBySeller.containsKey(restaurant)) {
				cartItemsBySeller.put(restaurant, new ArrayList<>());
			}

			// Add the cart item to the corresponding seller's list
			cartItemsBySeller.get(restaurant).add(cart);
		}

		// Generate orders for each seller
		List<Orders> orders = new ArrayList<>();

		for (Map.Entry<User, List<Cart>> entry : cartItemsBySeller.entrySet()) {

			List<Cart> sellerCartItems = entry.getValue();

			// Generate a unique order ID for each seller
			String orderId = Helper.generateOrderId();

			for (Cart cart : sellerCartItems) {

				Orders order = new Orders();
				order.setOrderId(orderId);
				order.setUser(user);
				order.setOrderTime(orderTime);
				order.setQuantity(cart.getQuantity());
				order.setFood(cart.getFood());
				order.setStatus(DeliveryStatus.PENDING.value());
				order.setDeliveryStatus(DeliveryStatus.PENDING.value());

				orders.add(order);

			}
		}

		List<Orders> addedOrders = this.orderService.addOrder(orders);

		if (addedOrders == null) {
			throw new OrderSaveFailedException("Failed to Order Foods");
		}

		try {
			this.cartService.deleteCarts(carts);
		} catch (Exception e) {
			throw new OrderSaveFailedException("Failed to Order Foods");
		}

		response.setResponseMessage("Order Placed Successful, Check Status is Dashboard");
		response.setSuccess(true);

		return new ResponseEntity<CommonApiResponse>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> fetchAllOrders() {

		LOG.info("Request received for fetching all orders");

		OrderResponseDto response = new OrderResponseDto();

		List<Orders> orders = new ArrayList<>();

		orders = this.orderService.getAllOrders();

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("No orders found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
		}

		response.setOrders(orders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> fetchUserOrders(int userId) {

		LOG.info("Request received for fetching all orders");

		OrderResponseDto response = new OrderResponseDto();

		if (userId == 0) {
			response.setResponseMessage("User Id missing");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User user = this.userService.getUserById(userId);

		if (user == null) {
			response.setResponseMessage("User not found, failed to fetch user orders");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Orders> orders = new ArrayList<>();

		orders = this.orderService.getOrdersByUserAndStatusIn(user,
				Arrays.asList(DeliveryStatus.PENDING.value(), DeliveryStatus.DELIVERED.value(),
						DeliveryStatus.ON_THE_WAY.value(), DeliveryStatus.PROCESSING.value()));

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("No orders found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
		}

		response.setOrders(orders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> fetchRestaurantOrders(int sellerId) {

		LOG.info("Request received for fetching all seller orders");

		OrderResponseDto response = new OrderResponseDto();

		if (sellerId == 0) {
			response.setResponseMessage("Restaurant Id missing");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User seller = this.userService.getUserById(sellerId);

		if (seller == null) {
			response.setResponseMessage("Restaurant not found, failed to fetch seller orders");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Orders> orders = new ArrayList<>();

		orders = this.orderService.getOrdersByRestaurantAndStatusIn(seller,
				Arrays.asList(DeliveryStatus.PENDING.value(), DeliveryStatus.DELIVERED.value(),
						DeliveryStatus.ON_THE_WAY.value(), DeliveryStatus.PROCESSING.value()));

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("No orders found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
		}

		response.setOrders(orders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> fetchOrdersByOrderId(String orderId) {

		LOG.info("Request received for fetching all orders");

		OrderResponseDto response = new OrderResponseDto();

		if (orderId == null) {
			response.setResponseMessage("Order Id missing");
			response.setSuccess(true);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Orders> orders = new ArrayList<>();

		orders = this.orderService.getOrdersByOrderId(orderId);

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("No orders found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
		}

		response.setOrders(orders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> assignDeliveryPersonForOrder(UpdateDeliveryStatusRequest request) {

		LOG.info("Request received for assigning the delivery person for order");

		OrderResponseDto response = new OrderResponseDto();

		if (request == null || request.getOrderId() == null || request.getDeliveryId() == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Orders> orders = this.orderService.getOrdersByOrderIdAndStatusIn(request.getOrderId(),
				Arrays.asList(DeliveryStatus.PENDING.value(), DeliveryStatus.DELIVERED.value(),
						DeliveryStatus.ON_THE_WAY.value(), DeliveryStatus.PROCESSING.value()));

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("no orders by found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User deliveryPerson = this.userService.getUserById(request.getDeliveryId());

		if (deliveryPerson == null) {
			response.setOrders(orders);
			response.setResponseMessage("Delivery Person not found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		for (Orders order : orders) {
			order.setDeliveryPerson(deliveryPerson);
			order.setDeliveryStatus(DeliveryStatus.PENDING.value());
		}

		List<Orders> updatedOrders = this.orderService.updateOrders(orders);

		if (updatedOrders == null) {
			throw new OrderSaveFailedException("Failed to assign the delivery person for the Order");
		}

		response.setOrders(updatedOrders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> updateDeliveryStatus(UpdateDeliveryStatusRequest request) {

		LOG.info("Request received for assigning the delivery person for order");

		OrderResponseDto response = new OrderResponseDto();

		if (request == null || request.getOrderId() == null || request.getDeliveryStatus() == null
				|| request.getDeliveryTime() == null || request.getDeliveryId() == 0) {
			response.setResponseMessage("missing input");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User deliveryPerson = this.userService.getUserById(request.getDeliveryId());

		List<Orders> orders = this.orderService.getOrdersByOrderIdAndStatusIn(request.getOrderId(),
				Arrays.asList(DeliveryStatus.PENDING.value(), DeliveryStatus.DELIVERED.value(),
						DeliveryStatus.ON_THE_WAY.value(), DeliveryStatus.PROCESSING.value()));

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("no orders by found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		if (deliveryPerson == null) {
			response.setOrders(orders);
			response.setResponseMessage("Delivery Person not found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		for (Orders order : orders) {
			order.setStatus(request.getDeliveryStatus());
			order.setDeliveryDate(request.getDeliveryDate());
			order.setDeliveryTime(request.getDeliveryTime());

			if (request.getDeliveryStatus().equals(DeliveryStatus.DELIVERED.value())) {
				order.setDeliveryStatus(DeliveryStatus.DELIVERED.value());
			}
		}

		List<Orders> updatedOrders = this.orderService.updateOrders(orders);

		if (updatedOrders == null) {
			throw new OrderSaveFailedException("Failed to update Order delivery status");
		}

		response.setOrders(updatedOrders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<OrderResponseDto> fetchDeliveryOrders(int deliveryPersonId) {

		LOG.info("Request received for fetching all delivery orders");

		OrderResponseDto response = new OrderResponseDto();

		if (deliveryPersonId == 0) {
			response.setResponseMessage("Delivery Person Id missing");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		User delivery = this.userService.getUserById(deliveryPersonId);

		if (delivery == null) {
			response.setResponseMessage("Delivery Person not found, failed to delivery orders");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.BAD_REQUEST);
		}

		List<Orders> orders = new ArrayList<>();

		orders = this.orderService.getOrdersByDeliveryPersonAndStatusIn(delivery,
				Arrays.asList(DeliveryStatus.PENDING.value(), DeliveryStatus.DELIVERED.value(),
						DeliveryStatus.ON_THE_WAY.value(), DeliveryStatus.PROCESSING.value()));

		if (CollectionUtils.isEmpty(orders)) {
			response.setResponseMessage("No orders found");
			response.setSuccess(false);

			return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
		}

		response.setOrders(orders);
		response.setResponseMessage("Orders fetched successful");
		response.setSuccess(true);

		return new ResponseEntity<OrderResponseDto>(response, HttpStatus.OK);
	}

	public ResponseEntity<List<String>> fetchAllDeliveryStatus() {

		List<String> deliveryStatus = new ArrayList<>();

		for (DeliveryStatus status : DeliveryStatus.values()) {
			deliveryStatus.add(status.value());
		}

		return new ResponseEntity<List<String>>(deliveryStatus, HttpStatus.OK);

	}

	public ResponseEntity<List<String>> fetchAllDeliveryTime() {
		List<String> deliveryTime = new ArrayList<>();

		for (DeliveryTime time : DeliveryTime.values()) {
			deliveryTime.add(time.value());
		}

		return new ResponseEntity<List<String>>(deliveryTime, HttpStatus.OK);
	}

}
