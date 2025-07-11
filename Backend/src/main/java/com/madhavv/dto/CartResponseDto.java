package com.madhavv.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import com.madhavv.entity.Cart;

import lombok.Data;

@Data
public class CartResponseDto extends CommonApiResponse {

	private List<Cart> carts = new ArrayList<>();
	
	private BigDecimal totalCartAmount = BigDecimal.ZERO;

}
