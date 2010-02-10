// AsyncDependencyManager
// (c) 2010-02-09 Cortland Klein <me@pixelcort.com>

/*globals AsyncDependencyManager x*/


var sys = require('sys'),
   repl = require("repl");

AsyncDependencyManager = function(tasks) {
  this.pendingTasks = tasks;
  this.progressTasks = [];
  this.callAvailableTasks();
};

AsyncDependencyManager.prototype.callAvailableTasks = function(){
  var pendingTasksNames = [],
      taskName, task, prerequisiteNames, i, l, otherTask,
      taskMustWait, pendingTaskName,
      prerequisiteName, j, l2;
  for (taskName in this.pendingTasks) {
    pendingTasksNames.push(taskName);
  }
  l=pendingTasksNames.length;
  
  if (!l) return; // We're done!
  
  for (taskName in this.pendingTasks) {
    task = this.pendingTasks[taskName];
    prerequisiteNames = task.name.split('_');
    l2 = prerequisiteNames.length;
    taskMustWait = 0;
    for (i=0; i<l; i++) {
      pendingTaskName = pendingTasksNames[i];
      // sys.puts('pendingTaskName: ' + pendingTaskName);
      for (j=0; j<l2; j++) {
        prerequisiteName = prerequisiteNames[j];
        // sys.puts('prerequisiteName: ' + prerequisiteName);
        if (pendingTaskName == prerequisiteName) {
          // sys.puts('taskMustWait');
          taskMustWait = 1;
          break;
        }
      }
      if (taskMustWait) break;
    }
    if (taskMustWait) {
      continue;
    }
    // Task has no dependencies!
    
    // Check to see if the task has allready been called
    if (taskName in this.progressTasks) continue;
    this.progressTasks[taskName] = task;
    
    // sys.puts('calling task ' + taskName + '...');
    this.callTask(taskName);
    
  }
};

AsyncDependencyManager.prototype.callTask = function(taskName) {
  var manager = this;
  var actualTaskName = taskName;
  var taskCallback = function(){
    // sys.puts('delete pendingTask ' + actualTaskName);
    delete manager.pendingTasks[taskName];
    manager.callAvailableTasks();
  };
  this.pendingTasks[taskName].call(taskCallback);
};
