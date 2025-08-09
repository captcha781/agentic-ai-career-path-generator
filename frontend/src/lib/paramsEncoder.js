function paramsEncoder(obj) {
  return new URLSearchParams(obj).toString();
}

export default paramsEncoder;
