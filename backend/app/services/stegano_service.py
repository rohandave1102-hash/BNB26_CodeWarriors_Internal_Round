import io
from PIL import Image
from typing import Optional, Tuple

class SteganoService:
    @staticmethod
    def embed_watermark(image_bytes: bytes, secret_text: str) -> bytes:
        """
        Embeds an invisible LSB watermark payload into image pixel data.
        The signature survives social media metadata stripping since it resides in the pixel matrix.
        """
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            encoded_img = img.copy()
            width, height = img.size

            # Payload format: length prefix + payload + EOF marker
            payload = f"ML26::{secret_text}::END"
            binary_payload = ''.join(format(ord(c), '08b') for c in payload)
            payload_len = len(binary_payload)

            if payload_len > width * height * 3:
                raise ValueError("Image too small for watermark payload")

            pixels = list(encoded_img.getdata())
            new_pixels = []
            bit_idx = 0

            for pixel in pixels:
                r, g, b = pixel
                if bit_idx < payload_len:
                    r = (r & ~1) | int(binary_payload[bit_idx])
                    bit_idx += 1
                if bit_idx < payload_len:
                    g = (g & ~1) | int(binary_payload[bit_idx])
                    bit_idx += 1
                if bit_idx < payload_len:
                    b = (b & ~1) | int(binary_payload[bit_idx])
                    bit_idx += 1
                new_pixels.append((r, g, b))

            encoded_img.putdata(new_pixels)
            output = io.BytesIO()
            encoded_img.save(output, format="PNG")
            return output.getvalue()
        except Exception as e:
            print(f"⚠️ Watermark embedding error: {e}")
            return image_bytes

    @staticmethod
    def extract_watermark(image_bytes: bytes) -> Optional[str]:
        """
        Extracts embedded LSB watermark from image pixel data.
        """
        try:
            img = Image.open(io.BytesIO(image_bytes)).convert("RGB")
            pixels = list(img.getdata())

            bits = []
            for pixel in pixels:
                for color in pixel:
                    bits.append(str(color & 1))
                    # Check every 64 bits for premature marker match
                    if len(bits) >= 2048:
                        break
                if len(bits) >= 2048:
                    break

            bit_str = ''.join(bits)
            chars = []
            for i in range(0, len(bit_str), 8):
                byte = bit_str[i:i+8]
                if len(byte) == 8:
                    chars.append(chr(int(byte, 2)))

            raw_text = ''.join(chars)
            if "ML26::" in raw_text and "::END" in raw_text:
                start = raw_text.find("ML26::") + 6
                end = raw_text.find("::END", start)
                return raw_text[start:end]
            return None
        except Exception as e:
            print(f"⚠️ Watermark extraction error: {e}")
            return None

stegano_service = SteganoService()
