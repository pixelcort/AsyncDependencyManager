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
