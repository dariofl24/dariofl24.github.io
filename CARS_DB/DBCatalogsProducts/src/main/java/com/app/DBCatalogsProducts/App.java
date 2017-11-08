package com.app.DBCatalogsProducts;

import java.util.List;
import java.util.function.Consumer;

import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

import com.app.hibernate.service.CatalogService;
import com.app.hibernate.srcs.Catalog;

public class App {
    public static void main( String[] args ) {
    	
    	ApplicationContext appContext = new ClassPathXmlApplicationContext("BeanLocations.xml");
    	
    	CatalogService service = (CatalogService) appContext.getBean("catalogService");
    	
		 //Catalog cat = new Catalog();
		 //cat.setName("Alfa Romeo");
		 //cat.setCatalogId("alfaRomeo");
		 
		 //service.saveCatalog(cat);
    	
    	List<Catalog> list=service.findAllCatalogs();
    	
    	System.out.println("Z: "+list.size());
    	
    	list.stream().forEach(new Consumer<Catalog>() {
    		
			public void accept(Catalog catalog) {
				System.out.println(catalog);
			}
			
		});
    	
    }
}
