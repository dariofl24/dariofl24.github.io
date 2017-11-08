package com.app.hibernate.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.app.hibernate.dao.CatalogDao;
import com.app.hibernate.service.CatalogService;
import com.app.hibernate.srcs.Catalog;

@Service("catalogService")
@Transactional
public class CatalogServiceImpl implements CatalogService {
	
	@Autowired
	CatalogDao dao;

	public void saveCatalog(Catalog catalog) {
		dao.saveCatalog(catalog);
	}

	public List<Catalog> findAllCatalogs() {
		return dao.findAllCatalogs();
	}

	public void deleteCatalogById(String Id) {
		dao.deleteById(Id);
	}

	public Catalog findById(String Id) {
		return dao.findById(Id);
	}

	public void updateCatalog(Catalog catalog) {
		dao.updateCatalog(catalog);
	}

}
