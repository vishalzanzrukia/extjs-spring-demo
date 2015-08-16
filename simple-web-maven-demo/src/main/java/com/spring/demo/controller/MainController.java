package com.spring.demo.controller;

import org.springframework.stereotype.Component;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * @author VishalZanzrukia
 *
 */
@Controller
@Component("MainController")
public class MainController {

	/**
	 * This method is called when the GET request has been made to the
	 * controller
	 */
	@RequestMapping(value = "main", method = RequestMethod.GET)
	public String loadMainPage() {
		return "layout";
	}
}
