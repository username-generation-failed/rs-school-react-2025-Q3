function assert(value: boolean, message: string): asserts value {
  if (!value) {
    throw new Error(message);
  }
}

export default assert;
