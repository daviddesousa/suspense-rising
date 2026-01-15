#!/bin/bash

SOURCE_IMAGE="petrone.jpg"
# Define the target widths in pixels
WIDTHS=( 302 672 906 1208 )

# Ensure the source file exists
if [ ! -f "$SOURCE_IMAGE" ]; then
    echo "Source image not found: $SOURCE_IMAGE"
    exit 1
fi

# Loop through the defined widths and generate images
for w in "${WIDTHS[@]}"; do
    # Extract filename and extension for naming the output file
    FILENAME="${SOURCE_IMAGE%.*}"
    EXTENSION="${SOURCE_IMAGE##*.}"
    OUTPUT_FILE="${FILENAME}-${w}.${EXTENSION}"

    echo "Resizing to width ${w}px: ${OUTPUT_FILE}"

    # Use 'magick' to resize the image
    # The '-resize' argument with a single width value (e.g., 320x)
    # maintains the aspect ratio automatically.
    # Use '-strip' to remove metadata, reducing file size.
    # Use '-quality 85' for a good balance of quality and file size for web.
    # Note: Trying with quality 95
    magick "$SOURCE_IMAGE" -resize "${w}x" -strip -quality 95 "$OUTPUT_FILE"
done

echo "Finished generating responsive images."
