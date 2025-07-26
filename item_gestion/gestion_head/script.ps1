$index = $args[0]
Write-Output " "
Write-Output "=========================="
Write-Output "          $index"


# Appeler get_url.js avec l'index
$url = node .\get_url.js $index
Write-Output "Node output: $url"


# Séparer displayname et texture URL
$parts = $url -split '\|'
$displayname = $parts[0].Trim()
$textureurl = $parts[1].Trim()

Write-Output "Displayname: $displayname"
Write-Output "Texture URL: $textureurl"

# download texture url
node .\get_img_by_url.js $textureurl

# Générer le render
Write-Output " "
python.exe .\render_head.py .\texture.png
Write-Output " "

# Convertir en base64
Write-Output " "
$base64 = python.exe .\png_to_base64.py .\texture_render.png

$base64length = $base64.Length
Write-Output "base64 length : $base64length"
Write-Output ""

# injecte dans le fichier head[index].json
$base64 | node .\add_img_to_file.js $index
Write-Output "=========================="
