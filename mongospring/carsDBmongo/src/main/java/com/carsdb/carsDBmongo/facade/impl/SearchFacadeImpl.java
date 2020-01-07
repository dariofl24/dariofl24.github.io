package com.carsdb.carsDBmongo.facade.impl;

import java.util.Arrays;
import java.util.List;

import com.carsdb.carsDBmongo.dto.CarModelInfoDto;
import com.carsdb.carsDBmongo.entity.CarModelInfo;
import com.carsdb.carsDBmongo.facade.SearchFacade;
import ma.glasnost.orika.MapperFacade;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Service;

@Service
public class SearchFacadeImpl implements SearchFacade
{
    private static final String _KEYWORDS = "keyWords";

    @Autowired
    private MongoTemplate mongoTemplate;

    @Autowired
    @Qualifier("defaultMapper")
    private MapperFacade mapperFacade;

    @Override
    public List<CarModelInfoDto> searchByText(final String term)
    {
        Query query = new Query();
        query.addCriteria(Criteria.where(_KEYWORDS).all(Arrays.asList(term.split(StringUtils.SPACE))));
        List<CarModelInfo> models = mongoTemplate.find(query, CarModelInfo.class);

        return mapperFacade.mapAsList(models, CarModelInfoDto.class);
    }

    @Override
    public List<CarModelInfoDto> searchByText(final String term, final int size, final int page)
    {
        return null;
    }
}
