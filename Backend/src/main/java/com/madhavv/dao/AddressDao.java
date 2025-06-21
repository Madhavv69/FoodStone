package com.madhavv.dao;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.madhavv.entity.Address;

@Repository
public interface AddressDao extends JpaRepository<Address, Integer> {

}
