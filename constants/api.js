const BASE_API_V1 = '/api'
const AUTH = 'auth'

export const GET_JIRA_USER_URL_API = `${BASE_API_V1}/${AUTH}/jira/current-user`
export const JIRA_ISSUE_TRANSITIONS_URL_API = `${BASE_API_V1}/${AUTH}/jira/issue-transition`
export const JIRA_ISSUES_URL_API = `${BASE_API_V1}/${AUTH}/jira/issues`
export const JIRA_ISSUE_WORK_LOG_URL_API = `${BASE_API_V1}/${AUTH}/jira/issue-worklogs`
