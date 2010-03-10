// AsyncDependencyManager
// (c) 2010-02-09 Cortland Klein <me@pixelcort.com>

/*globals exports*/

var sys = require('sys'),
   repl = require("repl"),
   AsyncDependencyManager;

var console = {log:function(x){sys.puts(x);}};

AsyncDependencyManager = function(tasks) {
  var taskName,
      task,
      prerequisiteTaskNames,
      prerequisiteTaskName,
      l,
      i,
      prerequisiteTask,
      startTasks;
  
  if (!this instanceof AsyncDependencyManager) return new AsyncDependencyManager(tasks);
  
  this.tasks = tasks;
  this.startTasks = {};
  
  for (taskName in tasks) { if (!tasks.hasOwnProperty(taskName)) continue;
    task = tasks[taskName];
    if (!task.name) { // Has no prerequisites
      this.startTasks[taskName] = task;
      continue;
    }
    prerequisiteTaskNames = task.name.split('_');
    for (i=0,l=prerequisiteTaskNames.length;i<l;i++) {
      prerequisiteTaskName = prerequisiteTaskNames[i];
      // console.log('prerequisiteTaskName: ' + prerequisiteTaskName);
      prerequisiteTask = tasks[prerequisiteTaskName];
      
      // Ensure task and prerequisiteTask have parents and children arrays
      if (!prerequisiteTask.hasOwnProperty('children')) prerequisiteTask.children = {};
      if (!task.hasOwnProperty('parents')) task.parents = {};
      
      // Setup pointers between two tasks
      task.parents[prerequisiteTaskName] = prerequisiteTask;
      prerequisiteTask.children[taskName] = task;
      
      sys.puts('task ' + taskName + ' depends on ' + prerequisiteTaskName);
    }
  }
  
  for (taskName in this.startTasks) { if (!this.startTasks.hasOwnProperty(taskName)) continue;
    task = this.startTasks[taskName];
    this.callTask(task);
  }
};

AsyncDependencyManager.prototype.callTask = function(task, parentCallbacksArguments) {
  var      manager = this,
      taskCallback = function() {
    var childTaskName,
        parentTaskName,
        childTask,
        parentTask,
        readyToCall,
        parentCallbacksArguments;
    task.isComplete = true;
    task.callbackArguments = arguments;
    if (!task.children) return; // Task has no children.
    for (childTaskName in task.children) { if (!task.children.hasOwnProperty(childTaskName)) continue;
      childTask = task.children[childTaskName];
      readyToCall = true;
      parentCallbacksArguments = {};
      for (parentTaskName in childTask.parents) { if (!childTask.parents.hasOwnProperty(parentTaskName)) continue;
        parentTask = childTask.parents[parentTaskName];
        if (!parentTask.isComplete) {
          readyToCall = false;
          break;
        } else {
          parentCallbacksArguments[parentTaskName] = parentTask.callbackArguments;
        }
      }
      if (readyToCall) manager.callTask(childTask, parentCallbacksArguments);
    }
  };
  task.call(taskCallback, parentCallbacksArguments);
};

///////////////////////////////

exports.AsyncDependencyManager = AsyncDependencyManager;
