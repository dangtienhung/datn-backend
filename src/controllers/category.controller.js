export const categoryController = {
  /* getAll */
  getAll: async (_, res) => {
    try {
      return res.status(201).json('Cận ăn cơm chưa');
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
  },
};
