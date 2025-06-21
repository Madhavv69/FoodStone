package com.madhavv;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.madhavv.entity.User;
import com.madhavv.service.UserService;
import com.madhavv.utility.Constants.UserRole;
import com.madhavv.utility.Constants.UserStatus;

@SpringBootApplication
public class FoodStoneApplication implements CommandLineRunner {

	private final Logger LOG = LoggerFactory.getLogger(FoodStoneApplication.class);

	@Autowired
	private UserService userService;

	@Autowired
	private PasswordEncoder passwordEncoder;
	
	public static void main(String[] args) {
		SpringApplication.run(FoodStoneApplication.class, args);
	}
	
	@Override
	public void run(String... args) throws Exception {

		User admin = this.userService.getUserByEmailIdAndRoleAndStatus("demo.admin@demo.com",
				UserRole.ROLE_ADMIN.value(), UserStatus.ACTIVE.value());

		if (admin == null) {

			LOG.info("Admin not found in system, so adding default admin");
			
			User user = new User();
			user.setEmailId("admin@demo.com");
			user.setPassword(passwordEncoder.encode("123456"));
			user.setRole(UserRole.ROLE_ADMIN.value());
			user.setStatus(UserStatus.ACTIVE.value());
			
			this.userService.addUser(user);

		}

	}

}
