package com.app.hibernate.service;

import java.util.List;

import com.app.hibernate.srcs.Catalog;

public interface CatalogService {
	
	void saveCatalog(Catalog catalog);
	 
    List<Catalog> findAllCatalogs();
 
    void deleteCatalogById(String Id);
 
    Catalog findById(String Id);
 
    void updateCatalog(Catalog catalog);

}
