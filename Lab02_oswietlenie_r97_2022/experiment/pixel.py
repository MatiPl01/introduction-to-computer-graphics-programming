from PIL import Image

def img_to_pixel(path, size, color_count, show_preview = False):
  with Image.open(path) as img:
    resized = img.resize(size)
    converted = resized.convert('P', palette=Image.ADAPTIVE, colors=color_count)
    rgb = converted.convert("RGB")
    if show_preview: rgb.show()
    colors = {}

    for i in range(size[1]):
      for j in range(size[0]):
        coords = (i, j)
        key = converted.getpixel(coords)
        if key in colors:
          continue
        colors[key] = rgb.getpixel(coords)

    return {
      'array': [[num_to_char(converted.getpixel((j, i))) for j in range(size[1])] for i in range(size[0])],
      'colors': colors
    }

def print_pixel_array(arr):
  print('\n'.join(''.join(map(str, row)) for row in arr))

def rgb_to_hex(rgb):
  return '%02x%02x%02x' % rgb

def num_to_char(num):
  return chr(num + 97)

if __name__ == '__main__':
  filename = 'parrot.jpg'
  size = (50, 50)
  colors = 26

  res = img_to_pixel(filename, size, colors, True)
  print_pixel_array(res['array'])
  print('\nColors:')
  for k, v in sorted(res['colors'].items()):
    print(f'{num_to_char(k)}: {rgb_to_hex(v)}')
