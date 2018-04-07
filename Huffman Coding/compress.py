import core
import sys

def writeToFile(path, start, data):
    file = open(path, 'w')
    file.write(start)
    
    file.close()
    file = open(path, 'ab')
    file.write(bytes(bytearray(data)))
    file.close()

def getStart(freq):
    start = ''
    for char in freq:
        if core.isNumber(char):
            start += '\\' + char + '\\'
        else:
            start += char
        start += str(freq[char])
    start += 'q**q'
    return start

def toBinary(data):
    ret = []
    for i in range(0, len(data), 8):
        ret.append(int(data[i:i+8], 2))
    return ret

def compress(path):
    frequencies = {}
    fileData = core.readFile(path)

    for char in fileData:
        if char in frequencies:
            frequencies[char] += 1
        else:
            frequencies[char] = 1
    
    frequencies = dict(sorted(frequencies.items(), key=core.operator.itemgetter(1), reverse=True))
    root = core.createTree(frequencies)

    encodings = core.getEncodings(root, '')

    compression = ''
    
    for char in fileData:
        compression += encodings[char]

    return (frequencies, compression)

def main(argv):
    freq, compressed =  compress(argv[1])
    start = getStart(freq)

    writeToFile(argv[2] + '.bin', start, toBinary(compressed))
    print('"' + argv[1] + '" was successfuly compressed into "' + argv[2] + '.bin"!')

main(sys.argv)