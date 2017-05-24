COMMON_CARTRIDGES = ["converse_core"]
US_CARTRIDGES     = ["site_us"]
DE_CARTRIDGES     = ["converse_emea","site_de"]
GB_CARTRIDGES     = ["converse_emea","site_gb"]
FR_CARTRIDGES     = ["converse_emea","site_fr"]
BE_CARTRIDGES     = ["converse_emea","site_be"]
ES_CARTRIDGES     = ["converse_emea","site_es"]
NL_CARTRIDGES     = ["converse_emea","site_nl"]
IT_CARTRIDGES     = ["converse_emea","site_it"]
EU_CARTRIDGES     = ["converse_emea","site_eu"]

module Cartridges
    def self.All
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat US_CARTRIDGES
        cartridges = cartridges.concat DE_CARTRIDGES
        cartridges = cartridges.concat GB_CARTRIDGES
        cartridges = cartridges.concat FR_CARTRIDGES
        cartridges = cartridges.concat BE_CARTRIDGES
        cartridges = cartridges.concat ES_CARTRIDGES
        cartridges = cartridges.concat NL_CARTRIDGES
        cartridges = cartridges.concat IT_CARTRIDGES
        cartridges = cartridges.concat EU_CARTRIDGES
    end

    def self.US
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat US_CARTRIDGES
    end

    def self.DE
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat DE_CARTRIDGES
    end

    def self.GB
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat GB_CARTRIDGES
    end

    def self.FR
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat FR_CARTRIDGES
    end

    def self.BE
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat BE_CARTRIDGES
    end

    def self.ES
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat ES_CARTRIDGES
    end

    def self.NL
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat NL_CARTRIDGES
    end

    def self.IT
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat IT_CARTRIDGES
    end
    
    def self.EU
        cartridges = []
        cartridges = cartridges.concat COMMON_CARTRIDGES
        cartridges = cartridges.concat EU_CARTRIDGES
    end
end

import 'tools/frontend/build_tasks/fecompiler.rake'
import 'tools/frontend/build_tasks/jslintor.rake'
import 'tools/frontend/build_tasks/qunitor.rake'
import 'tools/frontend/build_tasks/html_builder.rake'

namespace :frontend do
    # Production tasks
    desc "Prepares the JS and CSS files for production environments"
    task :production_build,    [:host] => ["html_builder:configure", "jslintor:lint", "fecompiler:compile", "qunitor:run"]

    desc "Prepares the JS and CSS files for US production environments"
    task :production_build_us, [:host] => ["html_builder:configure", "jslintor:lint", "fecompiler:compile_us", "qunitor:run_us"]

    desc "Prepares the JS and CSS files for GB production environments"
    task :production_build_gb, [:host] => ["html_builder:configure", "jslintor:lint", "fecompiler:compile_gb", "qunitor:run_gb"]

    # Development tasks
    desc "Prepares the JS and CSS files for development environments"
    task :developer_build,     [:host] => ["html_builder:configure", "jslintor:lint", "fecompiler:compile_dev", "qunitor:run"]

    desc "Prepares the JS and CSS files for US development environments"
    task :developer_build_us,  [:host] => ["html_builder:configure", "jslintor:lint", "fecompiler:compile_dev_us", "qunitor:run_us"]

    desc "Prepares the JS and CSS files for GB development environments"
    task :developer_build_gb,  [:host] => ["html_builder:configure", "jslintor:lint", "fecompiler:compile_dev_gb", "qunitor:run_gb"]

    # Minimal development build
    desc "Prepares JS and CSS files for commit"
    task :developer_build_minimal      => ["jslintor:lint", "fecompiler:compile_dev", "qunitor:run"]

    desc "Prepares JS and CSS files for US commit"
    task :developer_build_minimal_us   => ["jslintor:lint", "fecompiler:compile_dev_us", "qunitor:run_us"]

    desc "Prepares JS and CSS files for GB commit"
    task :developer_build_minimal_gb   => ["jslintor:lint", "fecompiler:compile_dev_gb", "qunitor:run_gb"]

    desc "Lint JS and run QUnit tests"
    task :lintqunit                    => ["jslintor:lint", "qunitor:run"]
end
