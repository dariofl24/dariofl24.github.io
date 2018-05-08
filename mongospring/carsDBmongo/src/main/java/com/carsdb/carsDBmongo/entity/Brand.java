package com.carsdb.carsDBmongo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "brand")
public class Brand {
	
	@Id
    private String id;
	
	private String name;
	
	private String logo_url;
	
	@Indexed(unique = true)
	private String code;
	
	public Brand id(String id){
		this.id = id;
		return this;
	}
	
	public Brand name(String name){
		this.name = name;
		return this;
	}
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getLogo_url() {
		return logo_url;
	}

	public void setLogo_url(String logo_url) {
		this.logo_url = logo_url;
	}

	@Override
	public String toString() {
		return "Brand [id=" + id + ", name=" + name + ", logo_url=" + logo_url + ", code=" + code + "]";
	}
	
}
