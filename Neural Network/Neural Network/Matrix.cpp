#include "Matrix.h"

#include <stdlib.h>
#include <time.h>

Matrix::Matrix(unsigned int rows, unsigned int columns)
{
	m_Rows = rows;
	m_Columns = columns;
	for (unsigned int i = 0; i < rows; i++) 
	{
		m_Data.push_back(std::vector<float>());
		for (unsigned int j = 0; j < columns; j++)
		{
			m_Data[i].push_back(0);
		}
	}
}

Matrix::Matrix(std::vector<std::vector<float>> data)
{
	m_Data = data;
	m_Rows = data.size();
	m_Columns = data[0].size();
}

Matrix Matrix::Add(Matrix other) const
{
	if (m_Rows == other.GetRows() && m_Columns == other.GetColumns())
	{
		Matrix m(m_Rows, m_Columns);

		for (unsigned int i = 0; i < m_Rows; i++)
		{
			for (unsigned int j = 0; j < m_Columns; j++)
			{
				m.SetAt(i, j, m_Data[i][j] + other.At(i, j));
			}
		}

		return m;
	}

	throw "Matrices have different sizes.";
}

Matrix Matrix::Add(float delta) const
{
	Matrix m(m_Rows, m_Columns);
	for (unsigned int i = 0; i < m_Rows; i++)
	{
		for (unsigned int j = 0; j < m_Columns; j++)
		{
			m.SetAt(i, j, m_Data[i][j] + delta);
		}
	}
	return m;
}

Matrix Matrix::Multiply(Matrix other) const
{
	if (m_Columns == other.GetRows())
	{
		Matrix m(m_Rows, other.GetColumns());
		for (unsigned int i = 0; i < m_Rows; i++)
		{
			for (unsigned int j = 0; j < other.GetColumns(); j++)
			{
				float item = 0;
				for (unsigned int k = 0; k < m_Columns; k++)
				{
					item += this->At(i, k) * other.At(k, j);
				}
				m.SetAt(i, j, item);
			}
		}

		return m;
	}

	throw "Matrices dimensions do not match.";
}

Matrix Matrix::HadamardMul(Matrix other) const
{
	if (m_Rows == other.GetRows() && m_Columns == other.GetColumns())
	{
		Matrix m(m_Rows, m_Columns);
		for (unsigned int i = 0; i < m_Rows; i++)
		{
			for (unsigned int j = 0; j < m_Columns; j++)
			{
				m.SetAt(i, j, m_Data[i][j] * other.At(i, j));
			}
		}

		return m;
	}

	throw "Matrices dimensions do not match.";
}

Matrix Matrix::Multiply(float mul) const
{
	Matrix m(m_Rows, m_Columns);
	for (unsigned int i = 0; i < m_Rows; i++)
	{
		for (unsigned int j = 0; j < m_Columns; j++)
		{
			m.SetAt(i, j, m_Data[i][j] * mul);
		}
	}
	return m;
}

void Matrix::Print() const
{
	for (unsigned int i = 0; i < m_Rows; i++) 
	{
		for (unsigned int j = 0; j < m_Columns; j++)
		{
			std::cout << m_Data[i][j] << " ";
		}
		std::cout << std::endl;
	}
}

void Matrix::Randomize()
{
	srand(time(NULL));

	for (unsigned int i = 0; i < m_Rows; i++)
	{
		for (unsigned int j = 0; j < m_Columns; j++)
		{
			this->SetAt(i, j, float(rand()) / float(RAND_MAX) * 2.0f - 1);
		}
	}
}

void Matrix::Map(float(*func)(float))
{
	for (unsigned int i = 0; i < m_Rows; i++)
	{
		for (unsigned int j = 0; j < m_Columns; j++)
		{
			m_Data[i][j] = func(m_Data[i][j]);
		}
	}
}

void Matrix::Map(float(*func)(float, unsigned int, unsigned int))
{
	for (unsigned int i = 0; i < m_Rows; i++)
	{
		for (unsigned int j = 0; j < m_Columns; j++)
		{
			m_Data[i][j] = func(m_Data[i][j], i, j);
		}
	}
}

Matrix Matrix::Map(Matrix m, float(*func)(float))
{
	Matrix result(m.GetRows(), m.GetColumns());
	for (unsigned int i = 0; i < m.GetRows(); i++)
	{
		for (unsigned int j = 0; j < m.GetColumns(); j++)
		{
			result.SetAt(i, j, func(m.At(i, j)));
		}
	}
	return result;
}

Matrix Matrix::Map(Matrix m, float(*func)(float, unsigned int, unsigned int))
{
	Matrix result(m.GetRows(), m.GetColumns());
	for (unsigned int i = 0; i < m.GetRows(); i++)
	{
		for (unsigned int j = 0; j < m.GetColumns(); j++)
		{
			result.SetAt(i, j, func(m.At(i, j), i, j));
		}
	}
	return result;
}

std::vector<std::vector<float>> Matrix::ToArray() const
{
	return m_Data;
}

Matrix Matrix::Transpose(Matrix m)
{
	Matrix result(m.GetColumns(), m.GetRows());
	for (unsigned int i = 0; i < result.GetRows(); i++)
	{
		for (unsigned int j = 0; j < result.GetColumns(); j++)
		{
			result.SetAt(i, j, m.At(j, i));
		}
	}
	return result;
}