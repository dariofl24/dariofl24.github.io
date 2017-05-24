utils_path = project_path = File.dirname(__FILE__) + "/"
filename = ARGV[0]
batchArray = [0,128,192,256,512,1024,2048,4096,8192]

batchArray.each do |batch|
  system utils_path + "pngout #{filename} -b#{batch} -r"
end
