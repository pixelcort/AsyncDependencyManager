// AsyncDependencyManager
// (c) 2010-02-09 Cortland Klein <me@pixelcort.com>

/*

Description: A task dependency manager for async things in node.js.

Usage: Create a new AsyncDependencyObject with a hash of tasks, 
       where the keys are the task names and the function names 
       are underscore-separated names of the prerequisite task names.
       
       In your functions, assign this as the callback function to your async 
       operation. this is assigned to an internal task management callback 
       that will call more tasks.

Usage Example:
new AsyncDependencyManager(
  {
    a: function () {
      sys.puts('a');
      setTimeout(this,Math.random()*1000);
    },
    b: function () {
      sys.puts('b');
      setTimeout(this,Math.random()*1000);
    },
    c: function a_b() {
      sys.puts('c');
      setTimeout(this,Math.random()*1000);
    },
    d: function c() {
      sys.puts('d');
      setTimeout(this,Math.random()*1000);
    },
    e: function c() {
      sys.puts('e');
      setTimeout(this,Math.random()*1000);
    },
    f: function d_c() {
      sys.puts('f');
      setTimeout(this,Math.random()*1000);
    },
    g: function e() {
      sys.puts('g');
      setTimeout(this,Math.random()*1000);
    },
    h: function f() {
      sys.puts('h');
      setTimeout(this,Math.random()*1000);
    },
    i: function g() {
      sys.puts('i');
      setTimeout(this,Math.random()*1000);
    },
    j: function f_g() {
      sys.puts('j');
      setTimeout(this,Math.random()*1000);
    }
  });

*/

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
