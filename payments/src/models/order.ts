import mongoose from 'mongoose';

interface orderAttrs {}

interface OrderDoc extends mongoose.Document {}

interface OrderModel extends mongoose.Model<OrderDoc> {}
