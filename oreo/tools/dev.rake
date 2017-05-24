require 'psych'

import 'tools/backend/unit.rake'

namespace :dev do
    desc 'Copy site template from staging into your sandbox'
    task :staging_sync_to_sandbox do
        config = Psych.load_file './dev.yaml'
        options = create_default_options(config)
        options << "--confoo-root-dir /home/vagrant/demandware/codeshare/confoo"
        options << "--env-override dev"

        sh "sh ./scripts/pull_backup_archive.sh"
        sh "ruby ./scripts/upload_staging_template_to_sandbox.rb #{options.join(' ')}"
    end

    desc 'Upload site template into the specified host.'
    task :upload_site_template do
        config = Psych.load_file './dev.yaml'

        options = create_default_options(config)
        options << "--confoo-root-dir /home/vagrant/demandware/codeshare/confoo"

        env_override = config['env_override']
        options << "--env-override #{env_override}" if env_override

        sh "ruby ./scripts/upload_site_templates.rb #{options.join(' ')}"
        File.delete "site_template.zip"
    end

    desc 'Upload cartridges for the specific version into the specified host.'
    task :upload_cartridges do
        config = Psych.load_file './dev.yaml'
        local_dir = config['cartridges']['local_dir']
        version = config['cartridges']['version']

        options = create_default_options(config)
        options << "--local-dir #{local_dir}"
        options << "--build-version #{version}"

        sh "ruby ./scripts/upload_cartridges.rb #{options.join(' ')}"
    end

    desc 'Activates build version.'
    task :activate_build_version do
        config = Psych.load_file './dev.yaml'
        version = config['cartridges']['version']

        options = create_default_options(config)
        options << "--build-version #{version}"

        sh "ruby ./scripts/activate_build_version.rb #{options.join(' ')}"
    end

    desc 'Cleans up code deployment by keeping the N specified recent versions.'
    task :cleanup_build_versions do
        config = Psych.load_file './dev.yaml'
        versions_to_keep = config['versions_to_keep']

        options = create_default_options(config)
        options << "--how-many-to-keep #{versions_to_keep}"

        sh "ruby ./scripts/cleanup_build_versions.rb #{options.join(' ')}"
    end

    desc 'Upload local images for the specific catalog into the specified host.'
    task :upload_catalog_images do
        config = Psych.load_file './dev.yaml'
        local_dir = config['catalog_images']['local_dir']
        catalog = config['catalog_images']['catalog']

        options = create_default_options(config)
        options << "--local-dir #{local_dir}/#{catalog}/default"
        options << "--catalog #{catalog}"

        sh "ruby ./scripts/upload_catalog_images.rb #{options.join(' ')}"
    end

    def create_default_options(config)
        [
            "--host #{config['host']}",
            "--user \"#{config['user']}\"",
            "--password \"#{config['password']}\""
        ]
    end
end
