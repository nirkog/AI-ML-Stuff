#include <iostream>
#include <time.h>
#include <stdlib.h>
#include <math.h>

#include "Perceptron.h"

float function(float x) 
{
	return x*3;
}

TrainingData* getTrainingData(int size) {
	TrainingData* data = (TrainingData*) malloc(sizeof(TrainingData) * size);

	for (int i = 0; i < size; i++) {
		float x = rand() % 100 - 50;
		float y = rand() % 100 - 50;

		int output = (y > function(x)) ? 1 : -1;
		float inputs[2] = {x, y};

		TrainingData td = {inputs, output};

		data[i] = td;
	}

	return data;
}

void main() 
{
	srand(time(NULL));

	std::cout << "Starting!" << std::endl;

	Perceptron p;
	Perceptron p2;
	p.setLearningConstant(0.000001f);

	int dataSize = 1000000;
	int testRuns = 100000;

	TrainingData* trainingData = getTrainingData(dataSize);
	TrainingData* testData = getTrainingData(testRuns);

	for (int i = 0; i < dataSize; i++)
	{
		p.train(trainingData[i]);
	}

	int success1 = 0;
	int success2 = 0;

	for (int i = 0; i < testRuns; i++) 
	{
		int guess1 = p.guess(testData[i].inputs, true);
		int guess2 = p2.guess(testData[i].inputs, false);

		if (guess1 == testData[i].output)
			success1++;
		
		if (guess2 == testData[i].output)
			success2++;
	}

	std::cout << "The trained perceptron got it right " << (((float) success1 / (float) testRuns) * 100.0f) << "% of the times!" << std::endl;
	std::cout << "The untrained perceptron got it right " << (((float) success2 / (float) testRuns) * 100.0f) << "% of the times!" << std::endl;

	std::cin.get();

	delete trainingData;
	delete testData;
	
}