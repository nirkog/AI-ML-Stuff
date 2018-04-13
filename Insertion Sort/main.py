def Swap(items, i, j):
    temp = items[i]
    items[i] = items[j]
    items[j] = temp

def InsertionSort(items):
    sortedItems = []
    i = 0
    for item in items:
        sortedItems.append(item)
        j = len(sortedItems) - 2
        itemIndex = i
        while j >= 0:
            if sortedItems[j] > item:
                Swap(sortedItems, itemIndex, j)
                itemIndex -= 1
            else:
                break
            j -= 1
        i += 1

    return sortedItems

def main():
    items = [3, 1, -923, 87, 3, 6, 28, -21]
    items = InsertionSort(items)

    print(items)

if __name__ == '__main__':
    main()