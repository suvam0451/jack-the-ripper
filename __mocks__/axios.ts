import axiosMain from "axios";

export default {
  get: jest.fn().mockReturnValue(1),
  create: jest.fn(() => {}),
};
