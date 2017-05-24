module Demandware
    module GlobalConstants

        LOGIN_URL_PATH = "/on/demandware.store/Sites-Site/default/ViewApplication-ProcessLogin"
        ACTIVATE_BUILD_URL_PATH = "/on/demandware.store/Sites-Site/default/ViewCodeDeployment-Activate"
        IMPEX_DISPATCH_URL_PATH = "/on/demandware.store/Sites-Site/default/ViewSiteImpex-Dispatch"
        IMPEX_STATUS_URL_PATH = "/on/demandware.store/Sites-Site/default/ViewSiteImpex-Status"
        CODE_DEPLOYMENT_VIEW_URL_PATH = "/on/demandware.store/Sites-Site/default/ViewCodeDeployment-Start"
        CODE_DEPLOYMENT_DISPATCH_URL_PATH = "/on/demandware.store/Sites-Site/default/ViewCodeDeployment-Dispatch"

        SITE_TEMPLATE_URL_PATH = "/on/demandware.servlet/webdav/Sites/Impex/src/instance"
        CARTRIDGES_URL_PATH = "/on/demandware.servlet/webdav/Sites/Cartridges"
        CATALOGS_URL_PATH = "/on/demandware.servlet/webdav/Sites/Catalogs"

        DEFAULT_PATH_TO_CERT_FILE = "certs/cert.staging.store.converse.demandware.net_01.crt"
        DEFAULT_PATH_TO_KEY_FILE = "certs/cert.staging.store.converse.demandware.net_01.key"
        DEFAULT_PASSPHRASE_FOR_CERT = "1226storeconverse2203"

        def construct_url(host, path, secure = true)
            "#{secure ? 'https' : 'http'}://#{host}#{path}"
        end

    end
end