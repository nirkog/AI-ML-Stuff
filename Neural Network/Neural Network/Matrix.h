#pragma once

#include <vector>
#include <iostream>

class Matrix
{
public:
	Matrix(unsigned int rows, unsigned int columns);
	Matrix(std::vector<std::vector<float>> data);

	std::vector<std::vector<float>> GetData() inline const { return m_Data; }

	Matrix Add(Matrix other) const;
	Matrix Add(float delta) const;
	Matrix operator+(Matrix other) inline const { return Add(other); }
	Matrix operator+(float delta) inline const { return Add(delta); }
	Matrix operator+=(Matrix other) { m_Data = Add(other).GetData(); return *this; }
	Matrix operator+=(float delta) { m_Data = Add(delta).GetData(); return *this; }

	Matrix Multiply(Matrix other) const;
	Matrix Multiply(float mul) const;
	Matrix operator*=(Matrix other) { m_Data = Multiply(other).GetData(); return *this; }
	Matrix operator*=(float delta) { m_Data = Multiply(delta).GetData(); return *this; }
	Matrix operator*(Matrix other) inline const { return Multiply(other); }
	Matrix operator*(float mul) inline const { return Multiply(mul); }

	Matrix HadamardMul(Matrix other) const;

	Matrix operator-(Matrix other) inline const { return Add(other * -1.0f); }
	Matrix operator-(float delta) inline const { return Add(-delta); }
	Matrix operator-=(Matrix other) { m_Data = Add(other * -1).GetData(); return *this; }
	Matrix operator-=(float delta) { m_Data = Add(-delta).GetData(); return *this; }

	bool operator==(const Matrix& other) const
	{
		return m_Data == other.GetData();
	}

	unsigned int GetRows() inline const { return m_Rows; }
	unsigned int GetColumns() inline const { return m_Columns; }

	void SetAt(unsigned int i, unsigned int j, float val) { m_Data[i][j] = val; }

	float At(unsigned int i, unsigned int j) inline const { return m_Data[i][j]; }

	void Print() const;

	void Randomize();

	friend std::ostream& operator<<(std::ostream& stream, const Matrix& other)
	{
		for (unsigned int i = 0; i < other.GetRows(); i++)
		{
			for (unsigned int j = 0; j < other.GetColumns(); j++)
			{
				stream << other.At(i, j) << "  ";
			}
			stream << std::endl << std::endl;
		}
		return stream;
	}

	void Map(float(*func)(float));
	void Map(float(*func)(float, unsigned int, unsigned int));
	static Matrix Map(Matrix m, float(*func)(float));
	static Matrix Map(Matrix m, float(*func)(float, unsigned int, unsigned int));

	std::vector<std::vector<float>> ToArray() const;

	static Matrix Transpose(Matrix m);
private:
	std::vector<std::vector<float>> m_Data;
	unsigned int m_Rows, m_Columns;
};