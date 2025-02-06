import mongoose from "mongoose";

import AutoIncrement from "mongoose-sequence";
const AutoIncrementInstance = AutoIncrement(mongoose);


const taskSchema = new mongoose.Schema(
  {
  title: { type: String, required: true },
  description: { type: String },
  completed: { type: Boolean, default: false },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
},
{
  timestamps: true
}
);

taskSchema.index({ userId: 1 });

taskSchema.plugin(AutoIncrementInstance , {
   inc_field: "taskId" ,
   id: "taskId_seq" ,
   start_seq: 1000});
const Task = mongoose.model("Task", taskSchema);
export default Task;
