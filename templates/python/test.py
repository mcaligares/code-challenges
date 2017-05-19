import unittest
from nose_parameterized import parameterized

class TestFunctions(unittest.TestCase):
	def test_something(self):
		self.assertEqual(True, True)

class TestSecuence(unittest.TestCase):
	@parameterized.expand([
		[True, True],
		[True, True]
	])

	def test_parametrized(self, first, second):
		self.assertEqual(first, second)

if __name__ == '__main__':
	unittest.main()
