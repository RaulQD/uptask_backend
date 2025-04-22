import mongoose, { Document, Schema, Types } from "mongoose";

export interface ISubTask extends Document {
  name: string;
  completed: boolean;
  task: Types.ObjectId;
}

export const SubTasksSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  task: {
    type: Types.ObjectId,
    ref: "Task",
    required: true,
  }
}, { timestamps: true });


const SubTask = mongoose.model<ISubTask>("SubTask", SubTasksSchema);
export default SubTask;