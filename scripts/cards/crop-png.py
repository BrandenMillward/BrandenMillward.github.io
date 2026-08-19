"""Crop a PNG to its top N rows. Pure stdlib: no PIL in this environment.

Chrome headless sizes its screenshot from --window-size but lays out against a
viewport ~87px shorter, so the only way to get both a 627px-tall viewport and a
627px-tall image is to render taller and cut the surplus off the bottom.
"""
import sys, zlib, struct

def chunks(data):
    i = 8
    while i < len(data):
        ln, typ = struct.unpack('>I4s', data[i:i+8])
        yield typ, data[i+8:i+8+ln]
        i += 8 + ln + 4

def chunk(typ, payload):
    return (struct.pack('>I', len(payload)) + typ + payload
            + struct.pack('>I', zlib.crc32(typ + payload) & 0xffffffff))

def paeth(a, b, c):
    p = a + b - c
    pa, pb, pc = abs(p-a), abs(p-b), abs(p-c)
    return a if (pa <= pb and pa <= pc) else (b if pb <= pc else c)

def crop_top(src, dst, keep):
    raw = open(src, 'rb').read()
    idat = b''
    for typ, payload in chunks(raw):
        if typ == b'IHDR':
            w, h, depth, color, comp, filt, inter = struct.unpack('>IIBBBBB', payload)
        elif typ == b'IDAT':
            idat += payload
    assert depth == 8 and inter == 0, (depth, inter)
    bpp = {0:1, 2:3, 3:1, 4:2, 6:4}[color]
    stride = w * bpp
    data = zlib.decompress(idat)

    # Undo per-scanline filtering
    out, prev = [], bytearray(stride)
    pos = 0
    for _ in range(h):
        ft = data[pos]; pos += 1
        line = bytearray(data[pos:pos+stride]); pos += stride
        for x in range(stride):
            a = line[x-bpp] if x >= bpp else 0
            b = prev[x]
            c = prev[x-bpp] if x >= bpp else 0
            if   ft == 1: line[x] = (line[x] + a) & 0xff
            elif ft == 2: line[x] = (line[x] + b) & 0xff
            elif ft == 3: line[x] = (line[x] + ((a+b) >> 1)) & 0xff
            elif ft == 4: line[x] = (line[x] + paeth(a, b, c)) & 0xff
        out.append(bytes(line)); prev = line

    body = b''.join(b'\x00' + row for row in out[:keep])
    hdr  = struct.pack('>IIBBBBB', w, keep, depth, color, comp, filt, inter)
    open(dst, 'wb').write(b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', hdr)
                          + chunk(b'IDAT', zlib.compress(body, 9)) + chunk(b'IEND', b''))
    return w, keep

if __name__ == '__main__':
    print("cropped to %dx%d" % crop_top(sys.argv[1], sys.argv[2], int(sys.argv[3])))
