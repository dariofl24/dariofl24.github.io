Converse Data Hub
=================


GOAL
------------ 

DataHub is a system that receives files and transforms the information needed for the
catalog into a set of files that Demandware can consume. 


VM SETUP
--------

* Use the following rake task to configure your datahub instance
  
  rake setup[dev]

* Datahub tasks are located in the *bin* directory. You can call them like:
  
    ruby ./process_merchandising_data.rb
