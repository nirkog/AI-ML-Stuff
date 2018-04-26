#include <iostream>
#include <stdlib.h>
#include <time.h>
#include <fstream>
#include <string>
#include <cstdlib>

#include "Matrix.h"
#include "NeuralNetwork.h"

int main()
{
	srand(time(NULL));

	NeuralNetwork brain(3, 3, 1);

	std::string line;
	std::ifstream file("data.csv");
	std::vector<std::vector<float>> data;
	if (file.is_open())
	{
		while (std::getline(file, line))
		{
			std::vector<float> tempData;
			std::string temp = "";
			int current = 0;
			for (int i = 0; i < line.length(); i++)
			{
				if (line[i] == ',') 
				{
					tempData.push_back(float(atoi(temp.c_str())) / (float) 255);
					temp = "";
					current++;
				}
				else if (line[i] != ' ')
				{
					temp += line[i];
				}
			}
			tempData.push_back(atoi(temp.c_str()));
			data.push_back(tempData);
		}
		file.close();
	}


	int trainingMul = 100;
	for (int i = 0; i < trainingMul; i++)
	{
		for (int j = 0; j < data.size(); j++)
		{
			int index = rand() % data.size();
			float inputs[3] = { data[index][0], data[index][1], data[index][2] };
			float targets[1] = { data[index][3] };
			brain.train(inputs, targets);
		}
		std::cout << "Finished " << data.size() << " samples, " << i << " iteration." << std::endl;
	}

	std::cout << std::endl;
	std::cout << "DONE TRAINING WITH " << data.size() << " SAMPLES, OVER " << trainingMul << " ITERATIONS";
	std::cout << std::endl;

	float test[3] = {1, 1, 1};
	std::cout << brain.guess(test)[0] << std::endl;

	const char* fileName = "predictions.csv";
	std::ofstream outputFile;
	outputFile.open(fileName);

	for (int i = 0; i < 200; i++)
	{
		float inputs[3] = { (float) rand() / RAND_MAX, (float) rand() / RAND_MAX , (float) rand() / RAND_MAX };
		int guess = round(brain.guess(inputs)[0]);

		outputFile << round(inputs[0] * 255) << ", " << round(inputs[1] * 255) << ", " << round(inputs[2] * 255) << ", " << guess << std::endl;
	}

	std::cout << "Wrote predictions to file " << fileName << std::endl;

	std::cin.get();

	return 0;
} 