import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser, type RegisteredUser } from "../utils/userStorage";

interface Task {
  id: string;
  title: string;
  course: string;
  dueDate: string;
  completed: boolean;
}

export default function DashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<RegisteredUser | null>(null);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "completed">("all");

  useEffect(() => {
    const activeUser = getCurrentUser();
    if (!activeUser) {
      navigate("/login");
      return;
    }
    setUser(activeUser);

    // Load user's tasks
    const storageKey = `stm_tasks_${activeUser.id}`;
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks) {
      try {
        setTasks(JSON.parse(savedTasks));
      } catch {
        // Fallback default tasks
        setTasks(getDefaultTasks());
      }
    } else {
      const initial = getDefaultTasks();
      setTasks(initial);
      localStorage.setItem(storageKey, JSON.stringify(initial));
    }
  }, [navigate]);

  const getDefaultTasks = (): Task[] => [
    { id: "t1", title: "Complete SPM Jira Sprint Plan", course: "Software Project Management", dueDate: "Tomorrow", completed: true },
    { id: "t2", title: "Review React & Vite Component Architecture", course: "Web Engineering", dueDate: "Friday", completed: false },
    { id: "t3", title: "Prepare Final Sprint Presentation", course: "Software Project Management", dueDate: "Next Monday", completed: false },
  ];

  const saveTasks = (updated: Task[]) => {
    setTasks(updated);
    if (user) {
      localStorage.setItem(`stm_tasks_${user.id}`, JSON.stringify(updated));
    }
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: Task = {
      id: `task_${Date.now()}`,
      title: newTitle.trim(),
      course: newCourse.trim() || "General",
      dueDate: "Upcoming",
      completed: false,
    };

    saveTasks([newTask, ...tasks]);
    setNewTitle("");
    setNewCourse("");
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  if (!user) return null;

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;

  const filteredTasks = tasks.filter((t) => {
    if (filter === "completed") return t.completed;
    if (filter === "pending") return !t.completed;
    return true;
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      {/* Header Profile Section */}
      <div className="flex flex-col gap-4 rounded-3xl bg-slate-900 p-8 text-white sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="inline-block rounded-full bg-blue-500/20 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-blue-300">
            Student Workspace (Protected)
          </span>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome, {user.name}!</h1>
          <p className="mt-1 text-sm text-slate-300">
            Logged in as <span className="font-medium text-white">{user.email}</span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="rounded-xl border border-white/20 bg-white/10 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-white/20"
          >
            Log out
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Tasks</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{totalTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</p>
          <p className="mt-2 text-3xl font-bold text-amber-600">{pendingTasks}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs font-bold uppercase tracking-wider text-emerald-600">Completed</p>
          <p className="mt-2 text-3xl font-bold text-emerald-600">{completedTasks}</p>
        </div>
      </div>

      {/* Task Manager Section */}
      <div className="mt-8 grid gap-8 lg:grid-cols-[1.8fr_1fr]">
        {/* Main Task List */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h2 className="text-xl font-bold text-slate-900">Your Action Items</h2>
            <div className="flex gap-1 rounded-xl bg-slate-100 p-1 text-xs font-medium text-slate-600">
              <button
                type="button"
                onClick={() => setFilter("all")}
                className={`rounded-lg px-3 py-1.5 transition ${filter === "all" ? "bg-white font-bold text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
              >
                All ({totalTasks})
              </button>
              <button
                type="button"
                onClick={() => setFilter("pending")}
                className={`rounded-lg px-3 py-1.5 transition ${filter === "pending" ? "bg-white font-bold text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
              >
                Pending ({pendingTasks})
              </button>
              <button
                type="button"
                onClick={() => setFilter("completed")}
                className={`rounded-lg px-3 py-1.5 transition ${filter === "completed" ? "bg-white font-bold text-slate-900 shadow-sm" : "hover:text-slate-900"}`}
              >
                Done ({completedTasks})
              </button>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            {filteredTasks.length === 0 ? (
              <div className="py-12 text-center text-slate-500">
                <p className="text-base font-semibold">No tasks in this view.</p>
                <p className="mt-1 text-xs">Add a task using the form or switch tabs.</p>
              </div>
            ) : (
              filteredTasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 transition hover:bg-slate-100/70"
                >
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`grid h-6 w-6 shrink-0 place-items-center rounded-lg border text-xs font-bold transition ${
                        task.completed
                          ? "border-emerald-600 bg-emerald-600 text-white"
                          : "border-slate-300 bg-white text-transparent hover:border-slate-400"
                      }`}
                      aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    >
                      ✓
                    </button>
                    <div>
                      <p className={`text-sm font-semibold ${task.completed ? "text-slate-400 line-through" : "text-slate-800"}`}>
                        {task.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2 text-xs text-slate-500">
                        <span className="rounded-md bg-blue-50 px-2 py-0.5 font-medium text-blue-700">{task.course}</span>
                        <span>• {task.dueDate}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    className="text-xs font-semibold text-slate-400 hover:text-red-600"
                    title="Delete task"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Add Task Panel */}
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Add New Task</h2>
          <p className="mt-1 text-xs text-slate-500">Capture assignments or deadlines quickly.</p>

          <form onSubmit={handleAddTask} className="mt-6 space-y-4">
            <div>
              <label htmlFor="task-title" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Task Title
              </label>
              <input
                id="task-title"
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Write Chapter 3 draft"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <div>
              <label htmlFor="task-course" className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-600">
                Course / Category
              </label>
              <input
                id="task-course"
                type="text"
                value={newCourse}
                onChange={(e) => setNewCourse(e.target.value)}
                placeholder="e.g. Software Project Management"
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Add Task
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
