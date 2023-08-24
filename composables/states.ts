import { Task } from '~/interfaces/tasksTracking'

export const useJiraIssues = () => useState<Task[]>('jiraIssues', () => [])
