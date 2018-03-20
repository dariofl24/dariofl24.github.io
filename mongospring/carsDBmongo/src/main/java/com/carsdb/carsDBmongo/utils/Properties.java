package com.carsdb.carsDBmongo.utils;

import java.util.List;
import java.util.stream.Collectors;

import com.carsdb.carsDBmongo.entity.CarType;
import com.carsdb.carsDBmongo.entity.DocumentState;
import com.carsdb.carsDBmongo.entity.EngineType;
import com.carsdb.carsDBmongo.entity.PowerTrainType;
import com.carsdb.carsDBmongo.entity.TractionType;
import com.carsdb.carsDBmongo.entity.TransmissionType;
import com.google.common.collect.Lists;

public class Properties {
	
	public static final List<String> TRANSMISSION_TYPE_LIST = 
			Lists.newArrayList(TransmissionType.values()).stream().map(type -> type.name()).collect(Collectors.toList());
	
	public static final List<String> TRACTION_TYPE_LIST = 
			Lists.newArrayList(TractionType.values()).stream().map(type -> type.name()).collect(Collectors.toList());
	
	public static final List<String> ENGINE_TYPE_LIST =
			Lists.newArrayList(EngineType.values()).stream().map(type -> type.name()).collect(Collectors.toList());
	
	public static final List<String> CAR_TYPE_LIST =
			Lists.newArrayList(CarType.values()).stream().map(type -> type.name()).collect(Collectors.toList());
	
	public static final List<String> POWER_TRAIN_TYPE_LIST =
			Lists.newArrayList(PowerTrainType.values()).stream().map(type -> type.name()).collect(Collectors.toList());
	
	public static final List<String> DOCUMENT_STATE_TYPE_LIST =
			Lists.newArrayList(DocumentState.values()).stream().map(type -> type.name()).collect(Collectors.toList());
	
}
