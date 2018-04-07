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

    for i in range(len(freq)):
        node = Node(list(freq.items())[i][1])
        node.addChar(list(freq.items())[i][0])
        heapq.heappush(nodes, node)
    
    while len(nodes) > 1:
        last = heapq.heappop(nodes)
        former = heapq.heappop(nodes)

        parentNode = Node(former.sum + last.sum)
        parentNode.left = last
        parentNode.right = former

        last.parent = parentNode
        former.parent = parentNode

        heapq.heappush(nodes, parentNode)

    return nodes[0]


def isNumber(s):
    try: 
        int(s)
        return True
    except ValueError:
        return False

def getEncodings(root, currentEn):
    if root == None:
        return

    if root.char != None:
        encodings[root.char] = currentEn
        return
    
    getEncodings(root.left, currentEn + '0')
    getEncodings(root.right, currentEn + '1')

    return encodings

def writeToFile(path, data):
    file = open(path, 'w')
    file.write(data)
    file.close()

'''def main():
    freq, compression = compress('test.txt')
    start = getStart(freq)

    writeToFile('compressed.bin', start, toBinary(compression))

    data = decompress('compressed.bin')
    print(data)'''