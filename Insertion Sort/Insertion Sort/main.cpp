#include <iostream>

void Swap(int* arr, int i, int j)
{
	int temp = arr[i];
	arr[i] = arr[j];
	arr[j] = temp;
}

int* insertionSort(int* items, int size)
{
	int* sorted = new int[size];

	for (int i = 0; i < size; i++) 
	{
		sorted[i] = items[i];

		if (i > 0)
		{
			for (int j = i - 2; j >= 0; i++)
			{
				if (sorted[j] > sorted[j + 1])
					Swap(sorted, i, j);
				else
					break;
			}
		}
	}

	return sorted;
}

int main()
{
	int a[] = { 12, 129, -12, 0, 8, 53, -90 };

	int* sorted = insertionSort(a, sizeof(a) / sizeof(int));

	for (int i = 0; i < 4; i++)
	{
		std::cout << sorted[i] << std::endl;
	}

	std::cin.get();

	return 0;
}