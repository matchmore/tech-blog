const { AsyncStorage } = require('react-native');

const save = async (key, value) => {
  await AsyncStorage.setItem(key, value);
}

const load = async (key) => {
  return await AsyncStorage.getItem(key);
}

const remove = async (key) => {
  return await  AsyncStorage.removeItem(key);
}

module.exports = {
  save,
  load,
  remove
}