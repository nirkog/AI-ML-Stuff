#pragma once

#include "Matrix.h"


/*
TODO:
-Serialize and Deserialize
-Batches
*/

struct Layers
{
	Matrix input, hidden, output, zHidden, zOutput;
};

class NeuralNetwork
{
public:
	NeuralNetwork(unsigned int inputs, unsigned int hidden, unsigned int outputs);

	std::vector<float> guess(float inputs[]) const;
	void train(float inputs[], float targets[]);

	void setLearningRate(float lr) { m_LearningRate = lr; }

	void Print() const;
private:
	Layers feedForward(float inputs[]) const;
private:
	Matrix m_HiddenWeights, m_OutputWeights, m_HiddenBias, m_OutputBias;
	float m_LearningRate;
	unsigned int m_Inputs, m_Outputs;
};