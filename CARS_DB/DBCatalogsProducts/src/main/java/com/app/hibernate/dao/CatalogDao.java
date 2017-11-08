package com.app.hibernate.dao;

import java.util.List;

import com.app.hibernate.srcs.Catalog;

public interface CatalogDao {
	
	void saveCatalog(Catalog catalog);
    
    List<Catalog> findAllCatalogs();
    
    void deleteById(String catalogId);
    
    Catalog findById(String catalogId);
     
    void updateCatalog(Catalog catlog);

}
