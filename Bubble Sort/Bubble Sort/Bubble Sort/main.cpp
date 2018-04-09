#include <iostream>

int* Swap(int* arr, int i1, int i2)
{
	int temp = arr[i1];
	arr[i1] = arr[i2];
	arr[i2] = temp;

	return arr;
}

int* BubbleSort(int* items, int size)
{
	bool swapped = true;
	while (swapped) 
	{
		swapped = false;
		for (int i = 1; i < size; i++)
		{
			if (items[i - 1] > items[i])
			{
				Swap(items, i - 1, i);
				swapped = true;
			}
		}
		size--;
	}

	return items;
}

int main()
{
	int a[] = { 1, 62, 13, 9, 76, 3, -90, 12, 32, 10 };

	BubbleSort(a, sizeof(a) / sizeof(int));

	for (int i = 0; i < sizeof(a) / sizeof(int); i++)
		std::cout << a[i] << std::endl;

	std::cin.get();
	return 0;
}