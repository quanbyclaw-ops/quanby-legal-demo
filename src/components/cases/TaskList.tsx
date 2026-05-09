'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import type { CaseTask, User, CasePriority } from '@/types'

type TaskWithUser = CaseTask & {
  assignedTo?: Pick<User, 'id' | 'firstName' | 'lastName' | 'avatarUrl'> | null
  createdBy: Pick<User, 'id' | 'firstName' | 'lastName'>
}

interface TaskListProps {
  caseId: string
  tasks: TaskWithUser[]
  onTasksChanged?: (tasks: TaskWithUser[]) => void
}

const PRIORITY_CONFIG: Record<CasePriority, { label: string; class: string }> = {
  URGENT: { label: 'Urgent', class: 'bg-red-100 text-red-700 border-red-200' },
  HIGH:   { label: 'High',   class: 'bg-orange-100 text-orange-700 border-orange-200' },
  MEDIUM: { label: 'Medium', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  LOW:    { label: 'Low',    class: 'bg-green-100 text-green-700 border-green-200' },
}

function isOverdue(task: TaskWithUser): boolean {
  if (task.isCompleted) return false
  if (!task.dueDate) return false
  return new Date(task.dueDate) < new Date()
}

function formatDueDate(date: Date | string | null): string {
  if (!date) return 'No due date'
  const d = new Date(date)
  const now = new Date()
  const diffDays = Math.ceil((d.getTime() - now.getTime()) / 86400000)
  if (diffDays < 0) return `Overdue by ${Math.abs(diffDays)}d`
  if (diffDays === 0) return 'Due today'
  if (diffDays === 1) return 'Due tomorrow'
  if (diffDays <= 7) return `Due in ${diffDays}d`
  return d.toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

export function TaskList({ caseId, tasks: initialTasks, onTasksChanged }: TaskListProps) {
  const [tasks, setTasks] = useState(initialTasks)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'MEDIUM' as CasePriority,
  })

  const updateTasks = (updated: TaskWithUser[]) => {
    setTasks(updated)
    onTasksChanged?.(updated)
  }

  const handleToggleComplete = async (task: TaskWithUser) => {
    try {
      const res = await fetch(`/api/cases/${caseId}/tasks`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: task.id, isCompleted: !task.isCompleted }),
      })
      const json = await res.json()
      if (json.success) {
        updateTasks(tasks.map((t) => (t.id === task.id ? json.data : t)))
      }
    } catch (err) {
      console.error(err)
    }
  }

  const handleAddTask = async () => {
    if (!form.title.trim()) return
    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/cases/${caseId}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          dueDate: form.dueDate ? new Date(form.dueDate).toISOString() : undefined,
          priority: form.priority,
        }),
      })
      const json = await res.json()
      if (json.success) {
        updateTasks([...tasks, json.data])
        setForm({ title: '', description: '', dueDate: '', priority: 'MEDIUM' })
        setIsDialogOpen(false)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const pending = tasks.filter((t) => !t.isCompleted)
  const completed = tasks.filter((t) => t.isCompleted)

  const TaskRow = ({ task }: { task: TaskWithUser }) => {
    const overdue = isOverdue(task)
    return (
      <div
        className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${
          task.isCompleted
            ? 'border-gray-100 bg-gray-50'
            : overdue
            ? 'border-red-100 bg-red-50'
            : 'border-gray-100 bg-white hover:border-navy-200'
        }`}
      >
        <button
          onClick={() => handleToggleComplete(task)}
          className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
            task.isCompleted
              ? 'bg-green-500 border-green-500 text-white'
              : overdue
              ? 'border-red-400 hover:border-red-500'
              : 'border-gray-300 hover:border-navy-400'
          }`}
        >
          {task.isCompleted && <span className="text-xs">✓</span>}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p
              className={`text-sm font-medium transition-all ${
                task.isCompleted ? 'line-through text-gray-400' : overdue ? 'text-red-700' : 'text-gray-900'
              }`}
            >
              {task.title}
            </p>
            <Badge
              className={`text-xs border flex-shrink-0 ${PRIORITY_CONFIG[task.priority as CasePriority]?.class}`}
            >
              {PRIORITY_CONFIG[task.priority as CasePriority]?.label ?? task.priority}
            </Badge>
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
          )}
          <div className="flex items-center gap-3 mt-1.5">
            <span
              className={`text-xs font-medium ${
                task.isCompleted ? 'text-gray-400' : overdue ? 'text-red-600' : 'text-gray-500'
              }`}
            >
              {overdue && !task.isCompleted && '⚠️ '}
              {formatDueDate(task.dueDate)}
            </span>
            {task.assignedTo && (
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 rounded-full bg-navy-100 flex items-center justify-center text-xs font-bold text-navy-700">
                  {task.assignedTo.firstName[0]}
                </div>
                <span className="text-xs text-gray-500">
                  {task.assignedTo.firstName} {task.assignedTo.lastName}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">Tasks</h3>
          <span className="text-xs bg-navy-100 text-navy-700 px-2 py-0.5 rounded-full font-medium">
            {pending.length} pending
          </span>
        </div>
        <Button
          size="sm"
          onClick={() => setIsDialogOpen(true)}
          className="bg-navy-950 hover:bg-navy-800 text-white"
        >
          + Add Task
        </Button>
      </div>

      {tasks.length === 0 && (
        <div className="text-center py-10 text-gray-400 text-sm border border-dashed border-gray-200 rounded-lg">
          No tasks yet. Add the first task to get started.
        </div>
      )}

      {pending.length > 0 && (
        <div className="space-y-2">
          {pending.map((task) => <TaskRow key={task.id} task={task} />)}
        </div>
      )}

      {completed.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mt-4 mb-2">
            Completed ({completed.length})
          </p>
          {completed.map((task) => <TaskRow key={task.id} task={task} />)}
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-navy-950">Add New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Title *</label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Prepare judicial affidavit"
                className="border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-700 mb-1.5 block">Description</label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Task details..."
                rows={2}
                className="border-gray-200 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Due Date</label>
                <Input
                  type="date"
                  value={form.dueDate}
                  onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
                  className="border-gray-200"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Priority</label>
                <select
                  value={form.priority}
                  onChange={(e) => setForm({ ...form, priority: e.target.value as CasePriority })}
                  className="w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
                >
                  <option value="URGENT">Urgent</option>
                  <option value="HIGH">High</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="LOW">Low</option>
                </select>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleAddTask}
              disabled={!form.title.trim() || isSubmitting}
              className="bg-navy-950 hover:bg-navy-800 text-white"
            >
              {isSubmitting ? 'Adding...' : 'Add Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
