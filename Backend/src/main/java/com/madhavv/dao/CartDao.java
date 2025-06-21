package com.madhavv.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.madhavv.entity.Cart;
import com.madhavv.entity.User;

@Repository
public interface CartDao extends JpaRepository<Cart, Integer> {

	List<Cart> findByUser(User user);

}
