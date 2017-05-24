# Require any additional compass plugins here.

# Set this to the root of your project when deployed:
http_path = "/"
additional_import_paths = [
    "../../../../../../converse_core/cartridge/static/default/css/package/sass",
    "../../../../../../converse_core/cartridge/static/default/css/package/sass/base"
]
css_dir = "../../stylesheets_tmp"
sass_dir = "sass"
images_dir = "../../images"
javascripts_dir = "../../js"
sprite_load_path = "cartridges/converse_core/cartridge/static/default/images"

# You can select your preferred output style here (can be overridden via the command line):
# output_style = :expanded or :nested or :compact or :compressed

# To enable relative paths to assets via compass helper functions. Uncomment:
relative_assets = true

# To disable debugging comments that display the original location of your selectors. Uncomment:
line_comments = true

# If you prefer the indented syntax, you might want to regenerate this
# project again passing --syntax sass, or you can uncomment this:
# preferred_syntax = :sass
# and then run:
# sass-convert -R --from scss --to sass sass scss && rm -rf sass && mv scss sass