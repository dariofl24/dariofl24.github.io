#/bin/bash

#The intention of this script is to run compass on the CSS folders we have in one single step.
# This script facilitates its usage from VMBoxManager for example.
cd /home/vagrant/demandware/codeshare/confoo/cartridges/converse_core/cartridge/static/default/css/package/
compass compile
exit_status=$?
if [ '0' != $exit_status ]; then
    echo " ************************************************************************* "
    echo " * "
    echo " *    $(basename $0):: compass exited with exit code $exit_status "
    echo " * "
    echo " ************************************************************************* "
    exit 5
fi
