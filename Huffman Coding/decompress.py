import core
import sys

def intToBin(num):
    temp = num
    binary = ''
    while len(binary) < 8:
        binary += str(temp % 2)
        temp = core.math.floor(temp / 2)
    
    return binary[::-1]

def decompress(path):
    file = open(path, 'rb')
    data = file.read()
    file.close()
    freq = {}
    lastData = ''
    i = 0
    dataStartIndex = 0
    for char in data:
        char = chr(char)
        if not core.isNumber(char) and not i == 0:
            if char == '\\':
                if lastData[0] == '\\' and core.isNumber(lastData[1]):
                    lastData = lastData[1]
                    i += 1
                    continue
            if len(lastData) > 1:
                freq[lastData[0]] = int(lastData[1:])
            if char == 'q':
                if data[i:i + 4] == b'q**q':
                    dataStartIndex = i + 4
                    break
            lastData = ''
        lastData += char
        i += 1
    
    compressedData = data[dataStartIndex:]
    binary = ''

    for char in compressedData:
        binary += intToBin(int(str(char)))
    
    root = core.createTree(freq)

    decompressed = ''

    current = root
    for i in binary:
        if current.left == None and current.right == None:
            decompressed += current.char
            current = root
        if i == '1':
            current = current.right
        elif i == '0':
            current = current.left
    
    return decompressed

def main(argv):
    data = decompress(argv[1])

    core.writeToFile(argv[2] + '.txt', data)
    print('"' + argv[1] + '" was successfuly decompressed into "' + argv[2] + '.txt"!')

main(sys.argv)