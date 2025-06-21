package com.madhavv.dto;

import java.util.ArrayList;
import java.util.List;

import com.madhavv.entity.Orders;

import lombok.Data;

@Data
public class OrderResponseDto extends CommonApiResponse {
	
	private List<Orders> orders = new ArrayList<>();

}
