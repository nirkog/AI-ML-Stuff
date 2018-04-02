#include "Perceptron.h"

#include <stdlib.h>
#include <iostream>

int activate(float sum) 
{
	if (sum != 0)
		return abs(sum) / sum;
	return -1;
}

Perceptron::Perceptron()
{
	for (int i = 0; i < 2; i++) 
	{
		float randW = rand() % 1000 / 1000.0f;
		m_Weights[i] = (rand() % 100 > 50) ? randW : -randW;
	}
}

int Perceptron::guess(float inputs[], bool train) const
{
	float sum = 0;
	for (int i = 0; i < 2; i++)
	{
		sum += m_Weights[i] * inputs[i];
	}

	return activate(sum);
}

void Perceptron::train(TrainingData data)
{
	int error = data.output - this->guess(data.inputs, false);

	for (int i = 0; i < 2; i++) 
	{
		m_Weights[i] += error * data.inputs[i] * m_LearningConstant;
	}
}

Perceptron::~Perceptron()
{
}
