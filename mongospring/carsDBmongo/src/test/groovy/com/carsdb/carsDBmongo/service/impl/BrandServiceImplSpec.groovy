package com.carsdb.carsDBmongo.service.impl

import java.util.Optional;

import com.carsdb.carsDBmongo.entity.Brand;
import com.carsdb.carsDBmongo.repository.BrandRepository
import com.carsdb.carsDBmongo.service.impl.BrandServiceImpl
import spock.lang.*

@Unroll
class BrandServiceImplSpec extends Specification {
	
	BrandRepository brandRepository = Mock()
	
	BrandServiceImpl serviceImpl = new BrandServiceImpl(brandRepository: brandRepository )
	
	def "should get entity by name" () {
		
		given:
		Optional opt = new Optional();
		
		when:
		serviceImpl.getByName("name")
		
		then:
		1 * brandRepository.getByName("name") >> opt 
	}
	
	def "should get entity by code" () {
		given:
		Optional opt = new Optional();
		
		when:
		serviceImpl.getByCode("code")
		
		then:
		1 * brandRepository.getByCode("code") >> opt
	}
	
	
	def "should find all entities" () {
		
		when:
		serviceImpl.findAll()
		
		then:
		1 * brandRepository.findAll()
	}
	
	def "should save entities" () {
		
		given:
		Brand brand = Mock()
		
		when:
		serviceImpl.save(brand)
		
		then:
		1 * brandRepository.save(brand);
	}
	
	def "should update exiting brand" () {
		given:
		Brand brand = Mock()
		Brand saved = Mock()
		Optional<Brand> optBrand = Optional.ofNullable( saved )
		
		when:
		serviceImpl.update(brand)
		
		then:
		brand.getCode() >> "code"
		brandRepository.getByCode("code") >> optBrand
		1 * brandRepository.save(brand) 
		
	}
	
	def "should throw exception for no existing brand" () {
		
		given:
		Brand brand = Mock()
		
		Optional<Brand> optBrand = Optional.empty()
		
		when:
		serviceImpl.update(brand)
		
		then:
		brand.getCode() >> "code"
		brandRepository.getByCode("code") >> optBrand
		thrown(RuntimeException)
		
	}
	
	def "should update entities with given ID in upsert operation" () {
		
		given:
		Brand brand = Mock()
		
		when:
		serviceImpl.upsert(brand)
		
		then:
		brand.getCode() >> "code"
		brand.getName() >> "Name"
		brand.getId() >> "id"
		
		0 * brand.setId(_)
		1 * brandRepository.save(brand);
	}
	
	def "should save entities with new ID in upsert operation" () {
		
		given:
		Brand brand = Mock()
		
		when:
		serviceImpl.upsert(brand)
		
		then:
		brand.getCode() >> "code"
		brand.getName() >> "Name"
		brand.getId() >> null
		
		1 * brand.setId("name")
		1 * brandRepository.save(brand);
	}
	
	
	
	
}
