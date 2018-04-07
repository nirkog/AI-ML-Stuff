import operator, time, heapq, math

encodings = {}

class Node:
    def __init__(self, sum):
        self.sum = sum
        self.right = None
        self.left = None
        self.char = None
        self.parent = None
    
    def addChar(self, char):
        self.char = char
    
    def __lt__(self, other):
        return self.sum < other.sum
    
    def __gt__(self, other):
        return self.sum > other.sum

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
        heapq.heappush(nodes, node)
        originalNodes.append(node)
    
    while len(nodes) > 1:
        last = heapq.heappop(nodes)
        former = heapq.heappop(nodes)

        parentNode = Node(former.sum + last.sum)
        parentNode.left = last
        parentNode.right = former

        last.parent = parentNode
        former.parent = parentNode

        heapq.heappush(nodes, parentNode)

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

def getEncodings(root, currentEn):
    if root == None:
        return

    if root.char != None:
        encodings[root.char] = currentEn
        return
    
    getEncodings(root.left, currentEn + '0')
    getEncodings(root.right, currentEn + '1')


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

    getEncodings(root, '')

    compression = ''
    
    for char in fileData:
        compression += encodings[char]

    print(compression[:100])

    return (frequencies, compression)

def intToBin(num):
    temp = num
    binary = ''
    while len(binary) < 8:
        binary += str(temp % 2)
        temp = math.floor(temp / 2)
    
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
    binary = ''

    for char in compressedData:
        binary += intToBin(int(str(char)))
    
    root, originalNodes = createTree(freq)
    getEncodings(root, '')

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

    data = decompress('compressed.bin')
    print(data)

if __name__ == '__main__':
    main()