function generateId() {
  const timestamp = Date.now() - 1420070400000;
  const randomDigits = Math.floor(Math.random() * 1000000000);
  return `${timestamp}${randomDigits}`;
}

module.exports = { generateId };
