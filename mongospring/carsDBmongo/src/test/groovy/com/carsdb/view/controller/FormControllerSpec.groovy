package com.carsdb.view.controller

import com.carsdb.carsDBmongo.entity.Brand
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.carsDBmongo.service.CarModelInfoService;
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

import spock.lang.*

@Unroll
class FormControllerSpec extends Specification {
	
	CarModelInfoService carModelInfoService = Mock()
	BrandService brandService = Mock()
	
	FormController controller = new FormController(carModelInfoService:carModelInfoService,
		brandService:brandService)
	
	def model = Mock(java.util.Map)
	def request = Mock(HttpServletRequest)
	def code = "code"
	
	HttpServletResponse response = Mock(){
		1 * setHeader("Cache-Control", "no-cache, no-store, must-revalidate")
		1 * setHeader("Pragma", "no-cache")
		1 * setDateHeader("Expires", 0)
	}

	//****
	
	def "get form for indicated manufacturer" () {
		given:
		
		Brand brand = Mock()
		brandService.getByCode(code) >> Optional.of(brand)
		
		when:
		def form=controller.getFormManufacturer(model,code,request,response)
		
		then:
		form == "formmanufacturer"
		
	}
	
}
