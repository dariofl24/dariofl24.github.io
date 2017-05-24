#!/bin/bash

DW_SANDBOX="dev10.store.converse.demandware.net"
DW_USER="dflores"
DW_PWD="conejoiD99+"
DW_PATTERN="customerror"

ruby scripts/dwtail.rb -h $DW_SANDBOX -u $DW_USER -p $DW_PWD -f $DW_PATTERN

