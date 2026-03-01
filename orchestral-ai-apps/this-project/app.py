from typing import Callable
import numpy as np

class GradientDescentOptimizer:
    def __init__(self, learning_rate: float = 0.01):
        self.learning_rate = learning_rate

    def step(self, params: np.ndarray, gradients: np.ndarray) -> np.ndarray:
        """Update parameters using gradient descent."""
        return params - self.learning_rate * gradients