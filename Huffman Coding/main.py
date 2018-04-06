import operator, time

class Node:
    def __init__(self, sum):
        self.sum = sum
        self.right = None
        self.left = None
        self.char = None
        self.parent = None
    
    def addChar(self, char):
        self.char = char

def readFile(path):
    file = open(path, 'r')
    data = file.read()
    file.close()
    return data

def createTree(freq):
    nodes = []
    originalNodes = []

    for i in range(len(freq)):
        node = Node(list(freq.items())[i][1])
        node.addChar(list(freq.items())[i][0])
        nodes.append(node)
        originalNodes.append(node)
    
    while not len(nodes) == 1:
        last = nodes[len(nodes) - 1] 
        former = nodes[len(nodes) - 2]

        parentNode = Node(former.sum + last.sum)
        parentNode.left = last
        parentNode.right = former

        last.parent = parentNode
        former.parent = parentNode

        if last in originalNodes:
            originalNodes[len(originalNodes) - 1].parent = parentNode
        if former in originalNodes:
            originalNodes[len(originalNodes) - 2].parent = parentNode

        nodes.insert(0, parentNode)

        nodes = nodes[0:len(nodes) - 2]

    return (nodes[0], originalNodes)


def isNumber(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

def findCharInNodes(char, nodes):
    for node in nodes:
        if node.char == char:
            return node
    return None

def compress(path):
    frequencies = {}
    fileData = readFile(path)

    for char in fileData:
        if char in frequencies:
            frequencies[char] += 1
        else:
            frequencies[char] = 1
    
    frequencies = dict(sorted(frequencies.items(), key=operator.itemgetter(1), reverse=True))
    root, originalNodes = createTree(frequencies)

    encodings = {}
    
    for char in frequencies.keys():
        encoding = ''
        node = findCharInNodes(char, originalNodes)
        current = node
        while not current == None:
            if not current.parent == None:
                if current == current.parent.left:
                    encoding += '0'
                elif current == current.parent.right:
                    encoding += '1'
            current = current.parent
        encodings[char] = encoding

    compression = ''
    
    for char in fileData:
        compression += encodings[char]
    
    return (frequencies, compression)

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
        if not isNumber(char) and not i == 0:
            if char == '\\':
                if lastData[0] == '\\' and isNumber(lastData[1]):
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
    print(bytearray.decode(compressedData.decode()))

def toBinary(data):
    ret = []
    for i in range(0, len(data), 8):
        ret.append(int(data[i:i+8], 2))
    return ret


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
        if isNumber(char):
            start += '\\' + char + '\\'
        else:
            start += char
        start += str(freq[char])
    start += 'q**q'
    return start

def main():
    freq, compression = compress('test.txt')
    start = getStart(freq)

    writeToFile('compressed.bin', start, toBinary(compression))

    decompress('compressed.bin')

if __name__ == '__main__':
    main()