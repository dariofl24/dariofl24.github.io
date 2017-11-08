package com.app.hibernate.dao.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.Query;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import com.app.hibernate.dao.AbstractDao;
import com.app.hibernate.dao.CatalogDao;
import com.app.hibernate.srcs.Catalog;

@Repository("catalogDao")
public class CatalogDaoImpl extends AbstractDao implements CatalogDao {

	public void saveCatalog(Catalog catalog) {
		persist(catalog);
	}

	public List<Catalog> findAllCatalogs() { System.out.println("----findAllCatalogs");
		Criteria criteria = getSession().createCriteria(Catalog.class);
        return (List<Catalog>) criteria.list();
	}

	public void deleteById(String catalogId) {
		Query query = getSession().createSQLQuery("delete from Catalog where catalogId = :catalogId");
        query.setString("catalogId", catalogId);
        query.executeUpdate();
	}
	
	public Catalog findById(String catalogId) {
		Criteria criteria = getSession().createCriteria(Catalog.class);
        criteria.add(Restrictions.eq("catalogId",catalogId));
        return (Catalog) criteria.uniqueResult();
	}

	public void updateCatalog(Catalog catlog) {
		this.getSession().update(catlog);

	}

}
