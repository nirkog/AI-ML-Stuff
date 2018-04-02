#pragma once

struct TrainingData
{
	float inputs[2];
	int output;

	TrainingData(float in[], int out)
	{
		inputs[0] = in[0];
		inputs[1] = in[1];
		output = out;
	}
};

class Perceptron
{
public:
	Perceptron();
	~Perceptron();

	void train(TrainingData data);
	int guess(float inputs[], bool train) const;

	float* getWeights() inline const {return (float*) m_Weights; }

	void setLearningConstant(float lc) { m_LearningConstant = lc; }
private:
	float m_Weights[2];
	float m_LearningConstant;
};

