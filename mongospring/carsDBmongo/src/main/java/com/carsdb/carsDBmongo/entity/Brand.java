package com.carsdb.carsDBmongo.entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "brand")
public class Brand {
	
	public Brand(String name, String code) {
		super();
		this.name = name;
		this.code = code;
	}

	@Id
    private String id;
	
	private String name;
	
	@Indexed(unique = true)
	private String code;

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

	@Override
	public String toString() {
		return "Brand [id=" + id + ", name=" + name + ", code=" + code + "]";
	}
	
}
