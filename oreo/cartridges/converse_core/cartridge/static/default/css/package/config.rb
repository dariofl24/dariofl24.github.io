# Require any additional compass plugins here.
project_path = File.dirname(__FILE__) + "/"
utils_dir = "utilities/"
utils_path =  project_path + utils_dir

# Set this to the root of your project when deployed:
http_path = "/"
additional_import_paths = ["sass/base"]
css_dir = "../../stylesheets_tmp"
sass_dir = "sass"
images_dir = "../../images"
javascripts_dir = "../../js"

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

#callback functions aren't aware of command line options, therefore we help by setting a var for them to use
optimize_images = (environment == :production) ? true : false

# callback - on_sprite_saved
# http://compass-style.org/help/tutorials/configuration-reference/
# http://pngquant.org/
on_sprite_saved do |filename|
	if !optimize_images
		puts "\nuse no image compression here for #{filename}"
	else
		if File.exists?(filename)
			optimize(filename, utils_path + "pngquant/pngquant --force --ext .png 256")
			optimize(filename, "ruby " + utils_path + "pngout/pngoutbatch.rb")
		end
	end

end

# fn - Run optimize command line for a specified script
# https://gist.github.com/2403117
def optimize(filename, script)
  system script + " " + filename
end
