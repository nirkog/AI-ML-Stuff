#include "NeuralNetwork.h"

#include <math.h>
#include <vector>

float activate(float x)
{
	//Sigmoid function
	return 1 / (1 + exp(-x));
}

float dActivate(float x)
{
	//Derivative of the sigmoid activation function
	return activate(x) * (1 - activate(x));
}

NeuralNetwork::NeuralNetwork(unsigned int inputs, unsigned int hidden, unsigned int outputs)
	: m_HiddenWeights(hidden, inputs), m_OutputWeights(outputs, hidden), m_HiddenBias(hidden, 1), m_OutputBias(outputs, 1)
{
	m_HiddenWeights.Randomize();
	m_OutputWeights.Randomize();
	m_HiddenBias.Randomize();
	m_OutputBias.Randomize();

	m_Inputs = inputs;
	m_Outputs = outputs;

	m_LearningRate = 0.1f;
}

Layers NeuralNetwork::feedForward(float inputs[]) const
{
	std::vector<std::vector<float>> inputVector;
	for (int i = 0; i < m_Inputs; i++)
	{
		inputVector.push_back(std::vector<float>());
		inputVector[i].push_back(inputs[i]);
	}

	Matrix inputMatrix = Matrix(inputVector);

	Matrix zHidden = m_HiddenWeights * inputMatrix + m_HiddenBias;
	Matrix hidden = Matrix::Map(zHidden, activate);

	Matrix zOutput = m_OutputWeights * hidden + m_OutputBias;
	Matrix output = Matrix::Map(zOutput, activate);

	Layers layers = {inputMatrix, hidden, output, zHidden, zOutput};

	return layers;
}

std::vector<float> NeuralNetwork::guess(float inputs[]) const
{
	std::vector<std::vector<float>> inputVector;
	for (int i = 0; i < m_Inputs; i++)
	{
		inputVector.push_back(std::vector<float>());
		inputVector[i].push_back(inputs[i]);
	}

	Matrix inputMatrix = Matrix(inputVector);

	Matrix hiddenWeightedSum =  m_HiddenWeights * inputMatrix + m_HiddenBias;
	hiddenWeightedSum.Map(activate);

	Matrix output = m_OutputWeights * hiddenWeightedSum + m_OutputBias;
	output.Map(activate);

	return output.ToArray()[0];
}

void NeuralNetwork::train(float inputs[], float targets[])
{
	Layers layers = feedForward(inputs);
	
	std::vector<std::vector<float>> targetVector;
	for (int i = 0; i < m_Outputs; i++)
	{
		targetVector.push_back(std::vector<float>());
		targetVector[i].push_back(targets[i]);
	}

	Matrix targetMatrix = Matrix(targetVector);
	Matrix inputMatrix = layers.input;
	Matrix zHidden = layers.zHidden;
	Matrix hidden = layers.hidden;
	Matrix zOutput = layers.zOutput;
	Matrix output = layers.output;
	//Matrix cost = Matrix::Map(output - targetMatrix, [](float val) { return pow(val, 2); });
	Matrix dCost = (output - targetMatrix) * 2;

	Matrix dCdO = (output - targetMatrix) * 2;
	Matrix dSigOutput = Matrix::Map(zOutput, dActivate);
	Matrix hiddenT = Matrix::Transpose(hidden);
	Matrix deltaWO = dSigOutput.HadamardMul(dCdO) * hiddenT;
	deltaWO *= -m_LearningRate;
	Matrix deltaBO = dSigOutput.HadamardMul(dCdO) * -m_LearningRate;

	m_OutputWeights += deltaWO;
	m_OutputBias += deltaBO;

	Matrix dSigHidden = Matrix::Map(zHidden, dActivate);
	Matrix outputWT = Matrix::Transpose(m_OutputWeights);
	Matrix dCdH = outputWT * dSigOutput.HadamardMul(dCdO);
	Matrix inputT = Matrix::Transpose(inputMatrix);
	Matrix deltaWH = dCdH.HadamardMul(dSigHidden) * inputT;
	deltaWH *= -m_LearningRate;
	Matrix deltaBH = dCdH.HadamardMul(dSigHidden) * -m_LearningRate;

	/*Matrix outputErrors = targetMatrix - output;
	Matrix gradients = Matrix::Map(zOutput, dActivate);
	gradients = gradients.HadamardMul(outputErrors);
	gradients *= m_LearningRate;

	Matrix hiddenT = Matrix::Transpose(hidden);
	Matrix weighODelta = gradients * hiddenT;

	m_OutputWeights += weighODelta;
	m_OutputBias += gradients;

	Matrix weightsOT = Matrix::Transpose(m_OutputWeights);
	Matrix hiddenErrors = weightsOT * outputErrors;

	Matrix hiddenGradient = Matrix::Map(zHidden, dActivate);
	hiddenGradient = hiddenGradient.HadamardMul(hiddenErrors);
	hiddenGradient *= m_LearningRate;

	Matrix inputsT = Matrix::Transpose(inputMatrix);
	Matrix weightHDelta = hiddenGradient * inputsT;

	m_HiddenWeights += weightHDelta;
	m_HiddenBias += hiddenGradient;*/

	m_HiddenWeights += deltaWH;
	m_HiddenBias += deltaBH;
}