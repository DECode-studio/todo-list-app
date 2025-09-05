class Api {
    static BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://todo-list-be-eight.vercel.app' //'https://ff417bb56617.ngrok-free.app' //

    static AUTH_SIGN_IN = '/api/auth/login'
    static AUTH_REGISTER = '/api/auth/register'

    static TASK_GET = '/api/task/get-tasks'
    static TASK_ADD = '/api/task/add-task'
    static TASK_EDIT = '/api/task/edit-task'
    static TASK_DELETE = '/api/task/delete-task'
}

export default Api