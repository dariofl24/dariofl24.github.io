package com.carsdb.carsDBmongo;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.entity.OpenGraphData;
import com.carsdb.carsDBmongo.service.BrandService;
import com.carsdb.carsDBmongo.service.CarModelInfoService;

//@SpringBootApplication
public class App implements CommandLineRunner {
	
	//@Autowired
	//private CarModelInfoRepository carModelInfoRepository;
	
	@Autowired
	private CarModelInfoService carModelInfoService;
	
	//@Autowired
	//private BrandRepository brandRepository;
	
	@Autowired
	private BrandService brandService;
	
	public static void main(String[] args) {
		SpringApplication.run(App.class, args);
	}

	@Override
	public void run(String... arg0) throws Exception {
		
		brandService.deleteAll();
		
		brandService.create( (new Brand()).id("Audi").name("audi") );
		
		
		// --------
		
		carModelInfoService.deleteAll();
		
		carModelInfoService.create( new CarModelInfo("mercedes benz",2018,3,"CLS") );
		carModelInfoService.create( new CarModelInfo("mercedes benz",2019,4,"A Class") );
		carModelInfoService.create( new CarModelInfo("bmw",2017,1,"4 series") );
		carModelInfoService.create( new CarModelInfo("porsche",2018,2,"Panamera") );
		
		CarModelInfo pagani = new CarModelInfo("pagani",2017,1,"Huayra");
		
		OpenGraphData openGraphData = new OpenGraphData();
		
		openGraphData.setTitle("Pagani Huayra Roadster");
		openGraphData.setDescription("The objective is always to outdo oneself. Pure beauty in all shapes and surfaces - this is the philosophy behind Horacio Pagani's latest creation. From this foundation is built a masterpiece with a perfect balance of attention to detail and technological advancement.");
		openGraphData.setImage("https://dariofl24.github.io/mysupercars/cars_images/Pagani-Huayra%20Roadster-2017/details/social.jpg");
		openGraphData.setUrl("https://dariofl24.github.io/mysupercars/cars/pagani-huayra-roadster-2017.html");
		
		pagani.setOpenGraphData(openGraphData);
		
		carModelInfoService.create( pagani );
		
		List<CarModelInfo> allCars =carModelInfoService.findAll(0,25);
		
		allCars.stream().forEach(c -> System.out.println(c+"\n-------------------------\n") );
		
	}
	
    
}
