const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");


let mongo: any
 
export const connectDB = async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
 
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

export const dropDB = async () => {
    if (mongo) {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
      await mongo.stop();
    }
  };

